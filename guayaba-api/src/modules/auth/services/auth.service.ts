import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../user/repositories/user.repository.js';
import { JwtService } from '../../../utils/jwt.service.js';
import { MailtrapService } from '../../../utils/mailtrap.service.js';
import { RegisterDto } from '../controllers/models/register.dto.js';
import { WalletService } from '../../wallet/services/wallet.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private confirmUrl: string = '';
  private baseUrl: string = '';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailtrapService: MailtrapService,
    private readonly walletService: WalletService,
    private readonly configService: ConfigService
  ) {
    this.confirmUrl = this.configService.get<string>('CONFIRM_URL') || '';
    this.baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:4500';
  }

  async login(
    identifier: string,
    password: string,
    rememberPassword: boolean,
  ): Promise<{ token: string }> {
    let user = await this.userRepository.findByEmail(identifier);

    if (!user) {
      user = await this.userRepository.findByPhone(identifier);
    }

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, userType: user.userType };
    const token = this.jwtService.generateToken(payload, rememberPassword);

    return { token };
  }

  public async register(dto: RegisterDto): Promise<void> {
    if (!dto.phoneNumber && !dto.email) {
      throw new ConflictException('Debes proporcionar al menos un número de teléfono o un correo electrónico.');
    }

    // 1. Check for existing phone if provided
    if (dto.phoneNumber) {
      const existingPhone = await this.userRepository.findByPhone(dto.phoneNumber);
      if (existingPhone) {
        throw new ConflictException('Ya existe un usuario con ese número de teléfono.');
      }
    }

    // 2. Check for existing email if provided
    if (dto.email) {
      const existingEmail = await this.userRepository.findByEmail(dto.email);
      if (existingEmail) {
        throw new ConflictException('Ya existe un usuario con ese correo.');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.newUser(dto, hashedPassword);

    // Initial Wallet creation
    await this.walletService.updateBalance(user.id, 0);

    // 3. Optional Email Confirmation
    if (dto.email) {
      const confirmToken = this.jwtService.generateToken(
        { sub: user.id, email: user.email, purpose: 'email-confirm' },
        false,
      );
      const confirmUrl = `${this.confirmUrl}token=${confirmToken}`;

      // Send confirmation email (non-blocking)
      const roleLabel = dto.userType === 3 ? 'Conductor' : 'Pasajero';
      setImmediate(() => {
        this.mailtrapService
          .sendRegistrationEmail(
            dto.email!,
            dto.firstName ?? '',
            roleLabel,
            confirmUrl,
          )
          .catch((err) =>
            this.logger.error(`Error sending registration email: ${err.message}`),
          );
      });
    }
  }

  /**
   * Sends a password reset email if the user exists. Silent if not found (security).
   */
  public async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return; // Don't reveal if email exists

    const resetToken = this.jwtService.generateToken(
      { sub: user.id, email: user.email, purpose: 'password-reset' },
      false, // expires in 24h by default; we rely on the JWT exp
    );

    const resetUrl = `${this.baseUrl}/api/auth/auth/reset-password?token=${resetToken}`;

    setImmediate(() => {
      this.mailtrapService
        .sendResetPasswordEmail(email, resetUrl)
        .catch((err) =>
          this.logger.error(`Error sending reset email: ${err.message}`),
        );
    });
  }

  /**
   * Verifies the reset token and updates the user's password.
   */
  public async resetPassword(token: string, newPassword: string): Promise<void> {
    const payload = this.jwtService.verifyToken(token);

    if (payload.purpose !== 'password-reset') {
      throw new UnauthorizedException('Token inválido.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(payload.sub, hashedPassword);
  }

  /**
   * Resends the email confirmation link for an authenticated user.
   */
  public async resendConfirmationEmail(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado.');

    if (user.emailConfirmed) {
      throw new ConflictException('El correo ya fue confirmado.');
    }

    const confirmToken = this.jwtService.generateToken(
      { sub: user.id, email: user.email, purpose: 'email-confirm' },
      false,
    );
    let confirmUrl = this.confirmUrl;
    confirmUrl = `${confirmUrl}token=${confirmToken}`;

    const roleLabel = (user.userType as number[])?.includes(3) ? 'Conductor' : 'Pasajero';

    setImmediate(() => {
      this.mailtrapService
        .sendRegistrationEmail(user.email, user.firstName ?? '', roleLabel, confirmUrl)
        .catch((err) =>
          this.logger.error(`Error resending confirmation email: ${err.message}`),
        );
    });
  }

  /**
   * Changes the password for an authenticated user.
   */
  public async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findByIdWithPassword(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado.');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);
  }
}
