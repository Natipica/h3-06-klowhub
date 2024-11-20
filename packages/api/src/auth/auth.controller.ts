import { Controller, Post, Body, UseGuards, Req, Get, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dts';
import { Response, Request } from 'express'; // Usa FastifyReply si trabajas con Fastify


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out successfully' });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto.email, registerDto.password);
    } catch (error:any) {
      return { message: error.message };
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() Res: Response,) {
    const body =  await this.authService.login(loginDto.email, loginDto.password);

    Res.cookie('accessToken', (await body).accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict',
      maxAge: 30 * 1000, // 30 segundos
    });

    Res.cookie('refreshToken', (await body).refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    // Responder con el usuario autenticado
    return Res.json(body);

  }



  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Req() req: Request, @Res() Res: Response) {
    const refreshToken = req.cookies['refreshToken']; // Obtener el refresh token de las cookies

    if (!refreshToken) {
      return Res.status(401).json({ message: 'Refresh token missing' });
    }

    try {
      const newTokens = await this.authService.refreshTokens(refreshToken);

      // Actualizar las cookies con los nuevos tokens
      Res.cookie('accessToken', newTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutos
      });

      Res.cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });

      return Res.json({ message: 'Tokens refreshed successfully' });
    } catch (error) {
      return Res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  }


  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Req() req: any) {
  //   return req.user;
  // }

  // @UseGuards(GoogleAuthGuard)
  // @Get('google')
  // async googleAuth() {}

  // @UseGuards(GoogleAuthGuard)
  // @Get('google/callback')
  // async googleAuthCallback(@Req() req: any) {
  //   console.log("data user google", req.user);
    
  //   return this.authService.login(req.user);
  // }
}
