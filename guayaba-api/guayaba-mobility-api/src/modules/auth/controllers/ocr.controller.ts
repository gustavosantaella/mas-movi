import { Controller, Post, Res, UseInterceptors, UploadedFiles, Logger } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { BaseController } from '../../../core/base.controller.js';
import { OcrService } from '../../../modules/auth/services/ocr.service';

@Controller('ocr')
export class OcrController extends BaseController {

  private readonly logger = new Logger(OcrController.name);

  constructor(private readonly ocrService: OcrService) {
    super();
  }

  @Post('verify')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'selfie', maxCount: 1 },
      { name: 'document', maxCount: 1 },
    ]),
  )
  async verifyIdentity(
    @UploadedFiles()
    files: {
      selfie?: Express.Multer.File[];
      document?: Express.Multer.File[];
    },
    @Res() res: Response,
  ) {
    try {
      const selfieFile = files.selfie?.[0];
      const documentFile = files.document?.[0];

      if (!selfieFile || !documentFile) {
        this.send(
          res,
          this.error('Se requieren ambas imágenes: selfie y documento.'),
          400,
        );
        return;
      }

      const result = await this.ocrService.verifyIdentity(
        selfieFile,
        documentFile,
      );

      this.send(res, this.success(result, 'Verificación completada'));
    } catch (err: any) {
      this.logger.error(err);
      this.send(
        res,
        this.error(err.message || 'Error al procesar la verificación.', 500),
        500,
      );
    }
  }
}