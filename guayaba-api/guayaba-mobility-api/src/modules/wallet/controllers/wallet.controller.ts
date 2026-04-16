import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { BaseController } from '@/core/base.controller.js';
import { WalletService } from '@/modules/wallet/services/wallet.service';

@Controller('wallets')
export class WalletController extends BaseController {
  constructor(private readonly walletService: WalletService) {
    super();
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    const wallet = await this.walletService.findByUserId(userId);
    this.send(res, this.success(wallet, 'Billetera del usuario.'));
  }

  @Get('passenger/:uuid')
  async findByPassengerUuid(@Param('uuid') uuid: string, @Res() res: Response) {
    const wallet = await this.walletService.findByPassengerUuid(uuid);
    this.send(res, this.success(wallet, 'Billetera del pasajero.'));
  }

  @Get('driver/:uuid')
  async findByDriverUuid(@Param('uuid') uuid: string, @Res() res: Response) {
    const wallet = await this.walletService.findByDriverUuid(uuid);
    this.send(res, this.success(wallet, 'Billetera del conductor.'));
  }
}

