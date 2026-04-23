import { Controller, Get, Param } from '@nestjs/common';

@Controller('driver')
export class DriverController {
  /**
   * GET /api/mobility/driver/:id/status
   * Always returns active — drivers don't need to start a session.
   * The QR works offline; passengers pay independently.
   */
  @Get(':id/status')
  getDriverStatus(@Param('id') id: string) {
    return { active: true, sessionId: id };
  }
}
