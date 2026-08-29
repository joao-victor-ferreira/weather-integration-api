import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { WeatherController } from "./controllers/weather.controller.js";
import { WeatherService } from "./services/weather.service.js";
import { WeatherApiService } from "./services/weather-api.service.js";

@Module({
	imports: [
		HttpModule.register({
			timeout: 5000,
			maxRedirects: 5,
		}),
	],

	controllers: [WeatherController],

	providers: [WeatherApiService, WeatherService],

	exports: [WeatherService],
})
export class WeatherModule {}
