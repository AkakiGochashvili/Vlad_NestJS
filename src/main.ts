import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true
		})
	);

	const config = new DocumentBuilder()
		.setTitle('Car sale - NestJS')
		.setDescription('Car sale - NestJS description')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const options: SwaggerDocumentOptions = {
		operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
	};
	const document = SwaggerModule.createDocument(app, config, options);
	SwaggerModule.setup('api', app, document);

	await app.listen(5005);
}
bootstrap();
