import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { TokenService } from './services/token.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await this.userService.validatePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = this.tokenService.generateTokens(user.id, user.email);
    return { message: 'Login successful', ...tokens };
  }

  async register(email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    await this.userService.create(email, password);
    return { message: 'Registration successful' };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken); // Verificar el token
      const userId = payload.userId;
  
      // Opcional: valida que el refresh token sea válido en la base de datos
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
  
      // Generar nuevos tokens
      const accessToken = this.jwtService.sign({ userId: user.id, email: user.email }, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign({ userId: user.id }, { expiresIn: '7d' });
  
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {      
      throw new Error('Invalid refresh token');
    }
  }
}
