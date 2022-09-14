import cookie from '@fastify/cookie';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { PrismaService } from './common/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const logger = app.get(Logger);
  logger.debug(`Starting on port ${port}...`);

  // @ts-expect-error TypeScript is complainig, but this is how it's supposed to be, according to docs:
  // https://docs.nestjs.com/techniques/cookies#use-with-fastify
  await app.register(cookie, {
    secret: configService.get<string>('COOKIE_SIGNING_SECRET'),
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(port);
}
void bootstrap();
