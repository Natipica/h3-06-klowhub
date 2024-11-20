import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token); // Valida el token
      request.user = payload; // Adjunta el usuario decodificado al objeto de solicitud
      return true;
    } catch (err) {
        console.log("error auth", err);
        
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
