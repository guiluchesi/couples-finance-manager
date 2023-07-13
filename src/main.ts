import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const DEFAULT_APPLICATION_PORT = 3000;
const APPLICATION_PORT = process.env.PORT || DEFAULT_APPLICATION_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(APPLICATION_PORT);
  console.log(`Application running on port ${APPLICATION_PORT}`);
}
bootstrap();
