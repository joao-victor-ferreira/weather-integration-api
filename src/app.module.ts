import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import configuration from "./config/configuration.js";
import { WeatherModule } from "./modules/weather/weather.module.js";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),

		WeatherModule,
	],
})
export class AppModule {}
