import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/users/user.model';
import { RolesService } from 'src/roles/roles.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import qs from 'qs';
import axios, { AxiosResponse } from 'axios';
import { IFacebookTokensData } from './interfaces/facebook-tokens-data.interface';
import { IGoogleTokensData } from './interfaces/google-tokens-data.interface';
import { IUserGoogleOrFacebook } from './interfaces/user_google-or-facebook.interfase';
import { TokensDto } from './dto/tokens.dto';
import { SmsSendlerService } from 'src/sms-sendler/sms-sendler.service';
import { PhoneNumberDto } from './dto/phone-number.dto';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import Redis from 'ioredis';
import { ITokens } from './interfaces/tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT') private redisClient: Redis,
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private smsSendlerService: SmsSendlerService,
  ) {}

  async register(dto: CreateUserDto): Promise<User> {
    if (await this.isVerifiedNumber(dto.phoneNumber)) {
      const user = await this.usersService.create(dto);
      await this.deleteOtp(dto.phoneNumber);
      return user;
    }
    throw new ConflictException(`Not verifid phone number`);
  }

  async login(dto: LoginUserDto): Promise<ITokens> {
    const user = await this.validateUser(dto);
    const tokens = await this.generateTokens(user);
    await user.update({ token: tokens.refreshToken });
    return tokens;
  }

  async refresh(dto: RefreshTokenDto): Promise<ITokens> {
    const user = await this.verifyRefreshTokenAndGetUser(dto);
    const tokens = await this.generateTokens(user);
    await user.update({ token: tokens.refreshToken });
    return tokens;
  }

  async logout(id: number): Promise<void> {
    await this.usersService.updateTokenIsNullById(id);
  }

  googleOAuthUrl(): string {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
      client_id: process.env.GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
    };
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  }

  facebookOAuthUrl(): string {
    const rootUrl = 'https://www.facebook.com/v16.0/dialog/oauth';
    const options = {
      redirect_uri: process.env.FB_OAUTH_REDIRECT_URI,
      client_id: process.env.FB_CLIENT_ID,
      scope: 'public_profile,email',
    };
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  }

  async googleOAuth(code: string): Promise<ITokens> {
    const { data }: { data: IGoogleTokensData } =
      await this.getGoogleOAuthTokens(code);
    const user = await this.getGoogleUsers(data);
    return this.getFacebookOrGoogleUserTokens(user);
  }

  async facebookOAuth(code: string): Promise<ITokens> {
    const { data }: { data: IGoogleTokensData } =
      await this.getFacebookOAuthTokens(code);
    const user = await this.getFacebookUsers(data);
    return this.getFacebookOrGoogleUserTokens(user);
  }

  async verificationNumber(dto: PhoneNumberDto): Promise<MessageInstance> {
    const OTP = this.generateOTP();
    const message = `Your OTP is ${OTP}. Please enter it to verify your account.`;
    const msg = await this.smsSendlerService.send({
      phoneNumber: dto.phoneNumber,
      message,
    });
    await this.redisClient.hset('OTP', dto.phoneNumber, OTP);
    return msg;
  }

  async verifyOTP(dto: VerifyOtpDto): Promise<string> {
    if (await this.otpIsValid(dto)) {
      await this.redisClient.hset('OTP', dto.phoneNumber, 'true');
      return `Verification of the user with phoneNumber ${dto.phoneNumber} by number is successful. Congratulations!`;
    }
    throw new BadRequestException('Invalid OTP code');
  }

  private async validateUser(dto: LoginUserDto): Promise<User> {
    const user = await this.usersService.getOneByEmail(dto.email);
    if (user && (await bcrypt.compare(dto.password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  private async generateTokens(user: User): Promise<ITokens> {
    const { role } = await this.rolesService.getOneById(user.roleId);
    const payload: IJwtPayload = { email: user.email, id: user.id, role };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      }),
    };
  }

  private async verifyRefreshTokenAndGetUser(
    dto: RefreshTokenDto,
  ): Promise<User> {
    try {
      const payload: IJwtPayload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      const user = await this.usersService.getById(payload.id);
      if (user.token !== dto.refreshToken) {
        throw new UnauthorizedException('Not authorized');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Not authorized');
    }
  }

  private async getGoogleOAuthTokens(
    code: string,
  ): Promise<AxiosResponse<any, any>> {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
      grant_type: 'authorization_code',
    };
    const headers = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    return axios.post(url, qs.stringify(values), headers);
  }

  private async getFacebookOAuthTokens(
    code: string,
  ): Promise<AxiosResponse<any, any>> {
    const url = 'https://graph.facebook.com/v16.0/oauth/access_token';
    const values = {
      code,
      client_id: process.env.FB_CLIENT_ID,
      client_secret: process.env.FB_CLIENT_SECRET,
      redirect_uri: process.env.FB_OAUTH_REDIRECT_URI,
      grant_type: 'authorization_code',
    };
    const headers = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    return axios.post(url, qs.stringify(values), headers);
  }

  private async getGoogleUsers(
    data: IGoogleTokensData,
  ): Promise<IUserGoogleOrFacebook> {
    const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.access_token}`;
    const headers = {
      headers: { Autorization: [data.token_type, data.id_token].join(' ') },
    };
    const { data: gooogleUser } = await axios.get(url, headers);
    return {
      email: gooogleUser.email,
      firstName: gooogleUser.given_name,
      lastName: gooogleUser.family_name,
      origin: process.env.GOOGLE_CLIENT_ORIGIN,
    };
  }

  private async getFacebookUsers(
    data: IFacebookTokensData,
  ): Promise<IUserGoogleOrFacebook> {
    const url = `https://graph.facebook.com/me?access_token=${data.access_token}&fields=email,name`;
    const {
      data: { name, email },
    } = await axios.get(url);
    if (!email) {
      throw new ForbiddenException('Facebook account is not email verified');
    }
    const [firstName, lastName] = name.split(' ');
    return {
      email,
      firstName,
      lastName,
      origin: process.env.FB_CLIENT_ORIGIN,
    };
  }

  private async getFacebookOrGoogleUserTokens(
    data: IUserGoogleOrFacebook,
  ): Promise<TokensDto> {
    let user = await this.usersService.getOneByEmail(data.email);
    if (user) {
      await this.usersService.updateById(data, user.id);
    } else {
      user = await this.usersService.create(data);
    }
    const tokens = await this.generateTokens(user);
    await user.update({ token: tokens.refreshToken });
    return tokens;
  }

  private generateOTP(): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  private async otpIsValid(dto: VerifyOtpDto): Promise<boolean> {
    const savedOTP = await this.redisClient.hget('OTP', dto.phoneNumber);
    return dto.OTP === savedOTP;
  }

  private async isVerifiedNumber(phoneNumber: string): Promise<boolean> {
    return (await this.redisClient.hget('OTP', phoneNumber)) === 'true';
  }

  private async deleteOtp(phoneNumber: string): Promise<void> {
    await this.redisClient.hdel('OTP', phoneNumber);
  }
}
