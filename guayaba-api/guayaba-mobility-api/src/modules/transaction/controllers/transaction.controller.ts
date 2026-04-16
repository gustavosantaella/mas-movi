import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { BaseController } from '@/core/base.controller.js';
import { TransactionService } from '../services/transaction.service';
import { UserService } from '@/modules/user/services/user.service';
import { TransferFareDto } from './models/transaction.dto.js';

@Controller('transactions')
export class TransactionController extends BaseController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {
    super();
  }

  /**
   * POST /transactions/transfer
   * Transfer credits to another user by email.
   */
  @Post('transfer')
  async transfer(
    @Body() body: { identifier: string; amount: number; extras?: string; searchBy?: 'email' | 'phone' },
    @Res() res: Response,
  ) {
    const senderId = this.getUserId();
    if (!senderId) {
      this.send(res, this.error('No autorizado'), 401);
      return;
    }

    try {
      const transaction = await this.transactionService.transfer(
        senderId,
        body.identifier,
        body.amount,
        body.extras,
        body.searchBy || 'email',
      );
      this.send(res, this.success(transaction, 'Transferencia exitosa.'));
    } catch (e: any) {
      const statusCode = e.status || 400;
      this.send(res, this.error(e.message || 'Error al procesar la transferencia.', statusCode), statusCode);
    }
  }

  /**
   * POST /transactions/verify-recipient
   * Check if a recipient exists and return their name.
   */
  @Post('verify-recipient')
  async verifyRecipient(
    @Body() body: { identifier: string; searchBy: 'email' | 'phone' },
    @Res() res: Response,
  ) {
    if (!body.identifier) {
      throw new BadRequestException('El identificador es obligatorio.');
    }

    const user = body.searchBy === 'email'
      ? await this.userService.findByEmail(body.identifier)
      : await this.userService.findByPhone(body.identifier);

    if (!user) {
      this.send(res, this.error('Usuario no encontrado', 404), 404);
      return;
    }

    this.send(res, this.success({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim() || user.email
    }, 'Usuario verificado.'));
  }

  /**
   * GET /transactions/me
   * Get history of user transactions.
   */
  @Get('me')
  async getMyTransactions(@Res() res: Response) {
    const userId = this.getUserId();
    if (!userId) {
      this.send(res, this.error('No autorizado', 401), 401);
      return;
    }

    const transactions = await this.transactionService.findAllByUserId(userId);
    this.send(res, this.success(transactions, 'Historial de transacciones.'));
  }
}
