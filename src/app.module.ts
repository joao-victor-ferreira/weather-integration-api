import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration.js";
import { PrismaModule } from "./database/prisma/prisma.module.js";
import { WeatherModule } from "./modules/weather/weather.module.js";
import { HealthModule } from "./health/health.module.js";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
		HealthModule,
		PrismaModule,
		WeatherModule,
		
	],
})
export class AppModule {}
