import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "./database/prisma/prisma.module.js";
import configuration from "./config/configuration.js";
import { WeatherModule } from "./modules/weather/weather.module.js";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),

		PrismaModule,

		WeatherModule,
	],
})
export class AppModule {}