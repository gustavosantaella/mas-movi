import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request, Response } from 'express';
import { JwtService } from '@/utils/jwt.service.js';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

export class BaseController {
  @Inject(JwtService)
  protected readonly jwtService: JwtService;

  @Inject(REQUEST)
  protected readonly request: Request;

  protected success<T>(data: T, message = 'OK'): ApiResponse<T> {
    return { success: true, message, data };
  }

  protected error(message: string, statusCode = 400): ApiResponse {
    return { success: false, message, statusCode };
  }

  /**
   * Envía la respuesta al cliente de inmediato.
   */
  protected send(res: Response, response: ApiResponse, statusCode = 200) {
    res.status(statusCode).json(response);
  }

  /**
   * Extrae el sub (user id) del token JWT automáticamente desde el request.
   */
  protected getUserId(): number | null {
    const authHeader = this.request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
      const token = authHeader.replace('Bearer ', '');
      const payload = this.jwtService.verifyToken(token);
      return payload.sub;
    } catch {
      return null;
    }
  }
}




