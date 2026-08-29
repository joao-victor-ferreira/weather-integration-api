import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CreateWeatherDto } from "../dto/create-weather.dto.js";
import { WeatherQueryDto } from "../dto/weather-query.dto.js";
import { WeatherResponseDto } from "../dto/weather-response.dto.js";
import { WeatherService } from "../services/weather.service.js";

@ApiTags("Weather")
@Controller("weather")
export class WeatherController {
	constructor(private readonly weatherService: WeatherService) {}

	@ApiOperation({
		summary: "Consultar clima atual",
		description: "Consulta os dados climáticos atuais de uma cidade.",
	})
	@ApiResponse({
		status: 200,
		description: "Dados climáticos retornados com sucesso.",
		type: WeatherResponseDto,
	})
	@ApiResponse({
		status: 404,
		description: "Cidade não encontrada.",
	})
	@Get()
	async getWeather(@Query() query: WeatherQueryDto) {
		return this.weatherService.getWeather(query.city);
	}

	@ApiOperation({
		summary: "Consultar e salvar dados climáticos",
		description:
			"Consulta os dados climáticos atuais de uma cidade e armazena o resultado no PostgreSQL.",
	})
	@ApiResponse({
		status: 201,
		description: "Dados climáticos salvos com sucesso.",
		type: WeatherResponseDto,
	})
	@ApiResponse({
		status: 404,
		description: "Cidade não encontrada.",
	})
	@Post()
	async createWeather(@Body() dto: CreateWeatherDto) {
		return this.weatherService.createWeather(dto.city);
	}

	@ApiOperation({
		summary: "Consultar histórico climático",
		description: "Retorna os registros climáticos armazenados no PostgreSQL.",
	})
	@ApiResponse({
		status: 200,
		description: "Histórico climático retornado com sucesso.",
		type: WeatherResponseDto,
		isArray: true,
	})
	@Get("history")
	async getWeatherHistory() {
		return this.weatherService.getWeatherHistory();
	}
}
