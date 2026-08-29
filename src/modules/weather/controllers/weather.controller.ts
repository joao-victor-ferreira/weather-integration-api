import {
	Body,
	Controller,
	Get,
	Post,
	Query,
} from "@nestjs/common";

import { CreateWeatherDto } from "../dto/create-weather.dto.js";
import { WeatherQueryDto } from "../dto/weather-query.dto.js";
import { WeatherService } from "../services/weather.service.js";

@Controller("weather")
export class WeatherController {
	constructor(
		private readonly weatherService: WeatherService,
	) {}

	@Get()
	async getWeather(
		@Query() query: WeatherQueryDto,
	) {
		return this.weatherService.getWeather(
			query.city,
		);
	}

	@Post()
	async createWeather(
		@Body() dto: CreateWeatherDto,
	) {
		return this.weatherService.createWeather(
			dto.city,
		);
	}
}