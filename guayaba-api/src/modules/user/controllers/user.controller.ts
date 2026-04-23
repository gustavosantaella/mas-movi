import { Body, Controller, Get, Headers, Patch, Post, Query, Res, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { BaseController } from '../../../core/base.controller';
import { UserService } from '../services/user.service';
import { JwtService } from '../../../utils/jwt.service';
import { WalletService } from '../../wallet/services/wallet.service';

@Controller('user')
export class UserController extends BaseController {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {
    super();
  }


  /**
   * GET /user/me
   * Returns the authenticated user's profile data.
   */
  @Get('me')
  async getProfile(
    @Res() res: Response,
  ) {
    try {
      const userId = this.getUserId();
      if (!userId) {
        this.send(res, this.error('Token inválido o no proporcionado.', 401), 401);
        return;
      }

      const user = await this.userService.findById(userId);
      const wallet = await this.walletService.findByUserId(userId);

      if (!user) {
        this.send(res, this.error('Usuario no encontrado.', 404), 404);
        return;
      }

      const userWithBalance = {
        ...user,
        balance: wallet?.balance ? Number(wallet.balance) : 0,
      };

      this.send(res, this.success(userWithBalance, 'Perfil obtenido.'));
    } catch {
      this.send(res, this.error('Token inválido o expirado.', 401), 401);
    }
  }

  /**
   * PATCH /user/me
   * Updates personal info (firstName, lastName, dateOfBirth).
   */
  @Patch('me')
  async updateProfile(
    @Body() body: { firstName?: string; lastName?: string; dateOfBirth?: string },
    @Res() res: Response,
  ) {
    try {
      const userId = this.getUserId();
      if (!userId) {
        this.send(res, this.error('Token inválido o no proporcionado.', 401), 401);
        return;
      }

      const updated = await this.userService.updateProfile(userId, {
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth,
      });

      this.send(res, this.success(updated, 'Perfil actualizado.'));
    } catch {
      this.send(res, this.error('Token inválido o expirado.', 401), 401);
    }
  }

  /**
   * POST /user/confirm-entity
   * Marks the user's entity as confirmed after successful OCR.
   */
  @Post('confirm-entity')
  async confirmEntity(
    @Body() body: { dni?: string; firstName?: string; lastName?: string; dateOfBirth?: string; sex?: string },
    @Res() res: Response,
  ) {
    try {
      const userId = this.getUserId();
      if (!userId) {
        this.send(res, this.error('Token no proporcionado.', 401), 401);
        return;
      }

      await this.userService.confirmEntity(userId, body);
      this.send(res, this.success(null, 'Entidad verificada.'));
    } catch {
      this.send(res, this.error('Token inválido o expirado.', 401), 401);
    }
  }



  /**
   * GET /user/checkMail?token=<jwt>
   * Verifies the JWT confirmation token and marks the email as confirmed.
   */
  @Get('checkMail')
  async checkMail(@Query('token') token: string, @Res() res: Response) {
    if (!token) {
      res.status(400).send(this.renderConfirmPage(false, 'Token no proporcionado.'));
      return;
    }

    try {
      const payload = this.jwtService.verifyToken(token);

      if (payload.purpose !== 'email-confirm') {
        res.status(400).send(this.renderConfirmPage(false, 'Token inválido.'));
        return;
      }

      await this.userService.confirmEmail(payload.sub);

      res.status(200).send(this.renderConfirmPage(true, '¡Tu correo ha sido confirmado exitosamente!'));
    } catch {
      res.status(400).send(this.renderConfirmPage(false, 'El enlace ha expirado o es inválido.'));
    }
  }

  /**
   * Renders a simple branded HTML page for the confirmation result.
   */
  private renderConfirmPage(success: boolean, message: string): string {
    const icon = success ? '✅' : '❌';
    const color = success ? '#10B981' : '#FF6B4A';
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmar correo — Guayaba</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #F7F7F9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 48px 40px;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .icon { font-size: 48px; margin-bottom: 16px; }
    .title {
      font-size: 22px; font-weight: 800;
      color: #2D3339; margin-bottom: 8px;
    }
    .message { font-size: 15px; color: #6B7280; line-height: 1.5; }
    .status { color: ${color}; font-weight: 700; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1 class="title">${success ? 'Correo confirmado' : 'Error'}</h1>
    <p class="message status">${message}</p>
    ${success ? '<p class="message" style="margin-top: 16px;">Ya puedes iniciar sesión en la app.</p>' : '<p class="message" style="margin-top: 16px;">Intenta registrarte de nuevo o contacta soporte.</p>'}
  </div>
</body>
</html>`;
  }
}
