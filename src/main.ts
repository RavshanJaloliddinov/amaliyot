import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './config';
import { AllExceptionFilter } from './common/filter/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const swagger = new DocumentBuilder()
    .setTitle('API nomi')
    .setDescription('API tavsifi')
    .setVersion('1.0')
    .addBearerAuth(  // Bearer Token sozlamalari
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // Token nomi
    )
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api', app, document);

  // app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(config.PORT, () => {
    console.log(`Running in ${config.PORT}`)
  });
}
bootstrap();
