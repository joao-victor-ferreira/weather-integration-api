import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import type { CreateWeatherDto } from "../dto/create-weather.dto.js";
import type { WeatherQueryDto } from "../dto/weather-query.dto.js";
import type { WeatherService } from "../services/weather.service.js";

@Controller("weather")
export class WeatherController {
	constructor(private readonly weatherService: WeatherService) {}

	@Get()
	async getWeather(@Query() query: WeatherQueryDto) {
		return this.weatherService.getWeather(query.city);
	}

	@Post()
	async createWeather(@Body() dto: CreateWeatherDto) {
		return this.weatherService.createWeather(dto.city);
	}

	@Get("history")
	async getWeatherHistory() {
		return this.weatherService.getWeatherHistory();
	}
}
