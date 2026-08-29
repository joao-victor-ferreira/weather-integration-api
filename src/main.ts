import rateLimit from "@fastify/rate-limit";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module.js";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	await app.register(rateLimit, {
		max: 60,
		timeWindow: "1 minute",
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle("Weather Integration API")
		.setDescription("API para integração com dados climáticos")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("docs", app, document);

	await app.listen(3000, "0.0.0.0");
}

bootstrap();
