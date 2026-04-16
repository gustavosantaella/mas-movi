import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

export interface OcrResult {
  facesMatch: boolean;
  confidence: number;
  documentData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    sex: string;
    documentNumber: string;
  };
}

@Injectable()
export class OcrService {
  private readonly genAI: GoogleGenAI;
  private readonly logger = new Logger(OcrService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY_SECRET');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY_SECRET is not configured');
    }
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async verifyIdentity(
    selfieFile: Express.Multer.File,
    documentFile: Express.Multer.File,
  ): Promise<OcrResult> {
    const selfieBase64 = selfieFile.buffer.toString('base64');
    const documentBase64 = documentFile.buffer.toString('base64');

    const prompt = `Eres un sistema experto de verificación de identidad. Se te proporcionan dos imágenes:

1. **Selfie**: Una foto tomada por el usuario.
2. **Documento**: Una foto de un documento de identidad (DNI o Pasaporte).

Realiza las siguientes tareas:

### Tarea 1: Comparación facial
Compara el rostro de la selfie con la foto del documento de identidad.
Determina si ambos rostros pertenecen a la misma persona.

### Tarea 2: Extracción de datos del documento
Extrae los siguientes datos del documento:
- **firstName**: Nombre(s)
- **lastName**: Apellido(s)
- **dateOfBirth**: Fecha de nacimiento (formato DD/MM/YYYY)
- **sex**: Sexo (M o F)
- **documentNumber**: Número de documento

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin bloques de código) con esta estructura exacta:
{
  "facesMatch": true o false,
  "confidence": número entre 0 y 100 representando la confianza de la comparación facial,
  "documentData": {
    "firstName": "string",
    "lastName": "string",
    "dateOfBirth": "string",
    "sex": "string",
    "documentNumber": "string"
  }
}

Si no puedes leer algún campo, coloca "N/A" como valor.
Si no puedes detectar un rostro en alguna de las imágenes, coloca facesMatch en false y confidence en 0.`;

    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: selfieFile.mimetype || 'image/jpeg',
                  data: selfieBase64,
                },
              },
              {
                inlineData: {
                  mimeType: documentFile.mimetype || 'image/jpeg',
                  data: documentBase64,
                },
              },
            ],
          },
        ],
      });

      const text = response.text?.trim();
      setImmediate(() => this.logger.log(`Respuesta cruda de Gemini: ${text}`));

      if (!text) {
        throw new BadRequestException(
          'No se recibió respuesta del modelo de IA.',
        );
      }

      // Clean response in case it comes wrapped in markdown code blocks
      const cleanJson = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      setImmediate(() => this.logger.debug(`JSON limpio: ${cleanJson}`));

      const result: OcrResult = JSON.parse(cleanJson);
      setImmediate(() => this.logger.log(`Resultado parseado: ${JSON.stringify(result, null, 2)}`));

      return result;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new BadRequestException(
          'La respuesta del modelo no es un JSON válido.',
        );
      }
      throw error;
    }
  }
}
