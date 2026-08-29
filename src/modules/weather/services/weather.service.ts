import { Injectable } from "@nestjs/common";

import type { WeatherApiService } from "./weather-api.service.js";

@Injectable()
export class WeatherService {
	constructor(private readonly weatherApiService: WeatherApiService) {}

	async getWeather(city: string) {
		const weather = await this.weatherApiService.getCurrentWeather(city);

		return weather;
	}
}
