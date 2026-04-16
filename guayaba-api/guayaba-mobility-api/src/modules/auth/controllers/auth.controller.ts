import { Body, Controller, Get, Headers, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../../../modules/auth/services/auth.service';
import { LoginDto } from '../../../modules/auth/controllers/models/login.dto.js';
import { BaseController } from '../../../core/base.controller.js';
import { RegisterDto } from '../../../modules/auth/controllers/models/register.dto.js';
import { JwtService } from '../../../utils/jwt.service';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
  ) {
    super();
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(
        body.email,
        body.password,
        body.rememberPassword ?? false,
      );
      this.send(res, this.success(result, 'Login exitoso'));
    } catch (err: any) {
      const statusCode = err.status || 500;
      this.send(res, this.error(err.message || 'Error al iniciar sesión.', statusCode), statusCode);
    }
  }

  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      await this.authService.register(body);
      this.send(res, this.success(null, 'Registro exitoso'));
    } catch (err: any) {
      const statusCode = err.status || 500;
      this.send(res, this.error(err.message || 'Error al registrar.', statusCode), statusCode);
    }
  }

  /**
   * POST /auth/forgot-password
   * Sends a password reset email. Always returns success (for security).
   */
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }, @Res() res: Response) {
    try {
      await this.authService.forgotPassword(body.email);
      this.send(res, this.success(null, 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'));
    } catch (err: any) {
      // Always return success for security
      this.send(res, this.success(null, 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'));
    }
  }

  /**
   * GET /auth/reset-password?token=
   * Shows the password reset HTML form.
   */
  @Get('reset-password')
  async showResetForm(@Query('token') token: string, @Res() res: Response) {
    if (!token) {
      res.status(400).send(this.renderResetPage('', 'Token no proporcionado.'));
      return;
    }
    res.status(200).send(this.renderResetPage(token));
  }

  /**
   * POST /auth/resend-confirmation
   * Resends the email confirmation link (requires auth).
   */
  @Post('resend-confirmation')
  async resendConfirmation(
    @Res() res: Response,
  ) {
    try {
      const userId = this.getUserId();
      if (!userId) {
        this.send(res, this.error('Token inválido o no proporcionado.', 401), 401);
        return;
      }
      await this.authService.resendConfirmationEmail(userId);
      this.send(res, this.success(null, 'Correo de confirmación reenviado.'));
    } catch (err: any) {
      const statusCode = err.status || 500;
      this.send(res, this.error(err.message || 'Error al reenviar correo.', statusCode), statusCode);
    }
  }

  /**
   * POST /auth/change-password
   * Changes the password for the authenticated user.
   */
  @Post('change-password')
  async changePassword(
    @Body() body: { currentPassword: string; newPassword: string },
    @Res() res: Response,
  ) {
    try {
      const userId = this.getUserId();
      if (!userId) {
        this.send(res, this.error('Token inválido o no proporcionado.', 401), 401);
        return;
      }
      await this.authService.changePassword(userId, body.currentPassword, body.newPassword);
      this.send(res, this.success(null, 'Contraseña actualizada exitosamente.'));
    } catch (err: any) {
      const statusCode = err.status || 500;
      this.send(res, this.error(err.message || 'Error al cambiar contraseña.', statusCode), statusCode);
    }
  }



  /**
   * POST /auth/reset-password
   * Verifies the token and updates the password.
   */
  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
    @Res() res: Response,
  ) {
    try {
      await this.authService.resetPassword(body.token, body.newPassword);
      this.send(res, this.success(null, 'Contraseña actualizada exitosamente.'));
    } catch (err: any) {
      const statusCode = err.status || 400;
      this.send(res, this.error(err.message || 'No se pudo actualizar la contraseña.', statusCode), statusCode);
    }
  }

  /**
   * Renders the branded password reset HTML page.
   */
  private renderResetPage(token: string, errorMessage?: string): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nueva contraseña — Guayaba</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #F7F7F9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 40px 32px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .logo { text-align: center; margin-bottom: 24px; font-size: 40px; }
    .title {
      font-size: 22px; font-weight: 800;
      color: #2D3339; text-align: center; margin-bottom: 8px;
    }
    .subtitle {
      font-size: 14px; color: #6B7280;
      text-align: center; margin-bottom: 24px;
    }
    .field { margin-bottom: 16px; }
    .field label {
      display: block; font-size: 13px; font-weight: 600;
      color: #2D3339; margin-bottom: 6px;
    }
    .field input {
      width: 100%; padding: 12px 14px; border: 1.5px solid #E5E7EB;
      border-radius: 10px; font-size: 15px; outline: none;
      transition: border-color 0.2s;
    }
    .field input:focus { border-color: #FF7B5F; }
    .btn {
      width: 100%; padding: 14px; border: none; border-radius: 50px;
      background: linear-gradient(135deg, #FF7B5F, #FF6B4A);
      color: #fff; font-size: 16px; font-weight: 700;
      cursor: pointer; margin-top: 8px;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.9; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .error {
      background: #FFF0EE; color: #FF6B4A; font-size: 13px;
      padding: 10px 14px; border-radius: 8px; margin-bottom: 16px;
      text-align: center; font-weight: 500;
    }
    .success {
      background: #ECFDF5; color: #10B981; font-size: 14px;
      padding: 16px; border-radius: 8px; text-align: center;
      font-weight: 600;
    }
    .hint {
      font-size: 12px; color: #9CA3AF; margin-top: 6px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🔒</div>
    ${errorMessage
        ? `<div class="error">${errorMessage}</div>`
        : `
    <h1 class="title">Nueva contraseña</h1>
    <p class="subtitle">Crea una nueva contraseña para tu cuenta</p>
    <div id="form-container">
      <div class="field">
        <label>Nueva contraseña</label>
        <input type="password" id="password" placeholder="••••••••" />
        <p class="hint">Mínimo 8 caracteres, 1 mayúscula y 1 símbolo especial</p>
      </div>
      <div class="field">
        <label>Confirmar contraseña</label>
        <input type="password" id="confirmPassword" placeholder="••••••••" />
      </div>
      <div id="error-box" class="error" style="display:none;"></div>
      <button class="btn" id="submitBtn" onclick="handleSubmit()">Cambiar contraseña</button>
    </div>
    <div id="success-box" style="display:none;">
      <div class="success">✅ Tu contraseña ha sido actualizada. Ya puedes iniciar sesión en la app.</div>
    </div>
    `}
  </div>
  <script>
    async function handleSubmit() {
      const pw = document.getElementById('password').value;
      const confirm = document.getElementById('confirmPassword').value;
      const errorBox = document.getElementById('error-box');
      const btn = document.getElementById('submitBtn');

      errorBox.style.display = 'none';

      if (pw.length < 8 || !/[A-Z]/.test(pw) || !/[^A-Za-z0-9]/.test(pw)) {
        errorBox.textContent = 'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula y 1 símbolo.';
        errorBox.style.display = 'block';
        return;
      }
      if (pw !== confirm) {
        errorBox.textContent = 'Las contraseñas no coinciden.';
        errorBox.style.display = 'block';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Actualizando...';

      try {
        const res = await fetch(window.location.origin + '/api/auth/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: '${token}', newPassword: pw }),
        });
        const data = await res.json();
        if (data.success) {
          document.getElementById('form-container').style.display = 'none';
          document.getElementById('success-box').style.display = 'block';
        } else {
          errorBox.textContent = data.message || 'Error al actualizar.';
          errorBox.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Cambiar contraseña';
        }
      } catch {
        errorBox.textContent = 'Error de conexión. Intenta de nuevo.';
        errorBox.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Cambiar contraseña';
      }
    }
  </script>
</body>
</html>`;
  }
}
