import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/exception.filter';
// import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('GDG KU API')
    .setDescription('GDG KU API입니다.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      'token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: "https://koreauniv.gdgoc.kr",
    credentials: true,
  });

  // const yaml = require('yaml');
  // fs.writeFileSync('./swagger.yaml', yaml.stringify(document));
  // SwaggerModule.setup("/api", app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
