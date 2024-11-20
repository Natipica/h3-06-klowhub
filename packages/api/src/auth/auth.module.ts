import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { GoogleStrategy } from '../strategies/google.strategy';
import { UserModule } from '../user/user.module';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService,
    // LocalStrategy, JwtStrategy, GoogleStrategy
  ],
  // exports: [AuthService], //no hace nada
})
export class AuthModule {}
