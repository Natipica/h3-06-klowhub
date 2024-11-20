import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service'; // Asegúrate de tener tu AuthService

@Injectable()
export class GoogleAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (!request.user) {
      throw new UnauthorizedException('User not authenticated via Google');
    }

    request.user = request.user; // El user viene de Passport tras el login exitoso
    return true;
  }
}
