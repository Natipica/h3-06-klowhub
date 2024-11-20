import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service'; // Asegúrate de tener tu AuthService

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;

    if (!email || !password) {
      throw new UnauthorizedException('Email or password missing');
    }

    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    request.user = user; // Agrega el usuario a la solicitud
    return true; // Permite que la solicitud continúe
  }
}
