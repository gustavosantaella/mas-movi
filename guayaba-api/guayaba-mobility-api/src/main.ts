import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug'] });

  // Enable CORS for the Flutter app
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
  });

  // Log every incoming request
  app.use((req, res, next) => {
    console.log(`📥 [Mobility] ${req.method} ${req.url}`);
    next();
  });

  app.setGlobalPrefix('/api/mobility');
  await app.listen(process.env.PORT ?? 3001);

  console.log(`🚌 Mobility API running on port ${process.env.PORT ?? 3001}`);
  console.log(`🔌 WebSocket listening at /socket.io (default path)`);
}
bootstrap();
