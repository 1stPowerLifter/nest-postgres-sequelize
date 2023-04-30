import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from 'src/users/user.model';
import { TokensDto } from './dto/tokens.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IRequestWithUser } from './interfaces/request-with-user.interface';
import { IRequestWithCode } from './interfaces/request-whith-code.interface';
import { PhoneNumberDto } from './dto/phone-number.dto';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ITokens } from './interfaces/tokens.interface';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authServise: AuthService) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 200, type: User })
  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<User> {
    return this.authServise.register(dto);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<ITokens> {
    return this.authServise.login(dto);
  }

  @ApiOperation({ summary: 'Reftresh user tokens' })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto): Promise<ITokens> {
    return this.authServise.refresh(dto);
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 204 })
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: IRequestWithUser): Promise<void> {
    const { id } = req.user;
    await this.authServise.logout(id);
  }

  @ApiOperation({ summary: 'Redirect to google login' })
  @ApiResponse({ status: 302 })
  @UseGuards(JwtAuthGuard)
  @Get('login/google')
  async loginGoogle(@Res() res: Response): Promise<void> {
    res.redirect(this.authServise.googleOAuthUrl());
  }

  @ApiOperation({ summary: 'Redirect to facebook login' })
  @ApiResponse({ status: 302 })
  @UseGuards(JwtAuthGuard)
  @Get('login/facebook')
  async loginFB(@Res() res: Response): Promise<void> {
    res.redirect(this.authServise.facebookOAuthUrl());
  }

  @ApiOperation({ summary: 'Google login' })
  @ApiResponse({ status: 200, type: TokensDto })
  @Get('oauth/google')
  async oAuthGoogle(@Req() req: IRequestWithCode): Promise<ITokens> {
    return this.authServise.googleOAuth(req.query.code);
  }

  @ApiOperation({ summary: 'Facebook login' })
  @ApiResponse({ status: 200, type: TokensDto })
  @Get('oauth/facebook')
  async oAuthFacebook(@Req() req: IRequestWithCode): Promise<ITokens> {
    return this.authServise.facebookOAuth(req.query.code);
  }

  @ApiOperation({ summary: 'Verification number' })
  @ApiResponse({ status: 204, type: TokensDto })
  @Post('verification-number')
  async verificationNumber(
    @Body() dto: PhoneNumberDto,
  ): Promise<MessageInstance> {
    return this.authServise.verificationNumber(dto);
  }

  @ApiOperation({ summary: 'Verification number' })
  @ApiResponse({ status: 204, type: TokensDto })
  @Post('otp')
  async verifyOTP(@Body() dto: VerifyOtpDto): Promise<string> {
    return this.authServise.verifyOTP(dto);
  }
}
