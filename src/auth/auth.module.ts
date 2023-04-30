import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from 'src/roles/roles.module';
import { SmsSendlerModule } from 'src/sms-sendler/sms-sendler.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    JwtModule.register({}),
    SmsSendlerModule,
    RedisModule,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
