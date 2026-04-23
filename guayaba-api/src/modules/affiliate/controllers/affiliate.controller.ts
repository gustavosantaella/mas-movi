import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Delete,
  Param,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { BaseController } from '../../../core/base.controller.js';
import { AffiliateService } from '../services/affiliate.service.js';

@Controller('affiliates')
export class AffiliateController extends BaseController {
  constructor(
    private readonly affiliateService: AffiliateService,
  ) {
    super();
  }

  /**
   * POST /affiliates
   * Save a recipient as an affiliated contact.
   */
  @Post()
  async affiliate(
    @Body() body: { identifier: string; alias?: string; searchBy?: 'email' | 'phone' },
    @Res() res: Response,
  ) {
    const userId = this.getUserId();
    if (!userId) {
      this.send(res, this.error('No autorizado', 401), 401);
      return;
    }

    if (!body.identifier) {
      throw new BadRequestException('El identificador es obligatorio.');
    }

    try {
      const affiliation = await this.affiliateService.affiliate(
        userId,
        body.identifier,
        body.alias,
        body.searchBy || 'email'
      );
      this.send(res, this.success(affiliation, 'Usuario afiliado con éxito.'));
    } catch (e: any) {
      const statusCode = e.status || 400;
      this.send(res, this.error(e.message || 'Error al afiliar usuario.', statusCode), statusCode);
    }
  }

  /**
   * GET /affiliates
   * Get all affiliated recipients for the current user.
   */
  @Get()
  async getAffiliates(@Res() res: Response) {
    const userId = this.getUserId();
    if (!userId) {
      this.send(res, this.error('No autorizado', 401), 401);
      return;
    }

    try {
      const affiliates = await this.affiliateService.getAffiliates(userId);
      this.send(res, this.success(affiliates, 'Lista de afiliados.'));
    } catch (e: any) {
      const statusCode = e.status || 400;
      this.send(res, this.error(e.message || 'Error al obtener afiliados.', statusCode), statusCode);
    }
  }

  /**
   * DELETE /affiliates/:id
   * Remove an affiliated recipient.
   */
  @Delete(':id')
  async deleteAffiliate(@Param('id') id: string, @Res() res: Response) {
    const userId = this.getUserId();
    if (!userId) {
      this.send(res, this.error('No autorizado', 401), 401);
      return;
    }

    try {
      await this.affiliateService.deleteAffiliate(userId, parseInt(id));
      this.send(res, this.success(null, 'Afiliado eliminado con éxito.'));
    } catch (e: any) {
      const statusCode = e.status || 400;
      this.send(res, this.error(e.message || 'Error al eliminar afiliado.', statusCode), statusCode);
    }
  }
}
