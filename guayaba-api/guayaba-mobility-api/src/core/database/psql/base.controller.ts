import type { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

export class BaseController {
  protected success<T>(data: T, message = 'OK'): ApiResponse<T> {
    return { success: true, message, data };
  }

  protected error(message: string, statusCode = 400): ApiResponse {
    return { success: false, message, statusCode };
  }

  /**
   * Envía la respuesta al cliente de inmediato y permite
   * que el método del controller siga ejecutándose.
   */
  protected send(res: Response, response: ApiResponse, statusCode = 200) {
    res.status(statusCode).json(response);
  }
}

