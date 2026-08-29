import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CreateWeatherDto } from "../dto/create-weather.dto.js";
import { WeatherHistoryQueryDto } from "../dto/weather-history-query.dto.js";
import { WeatherResponseDto } from "../dto/weather-response.dto.js";
import { WeatherService } from "../services/weather.service.js";

@ApiTags("Weather")
@Controller("weather")
export class WeatherController {
	constructor(private readonly weatherService: WeatherService) {}

	@Post()
	@ApiOperation({
		summary: "Consultar e salvar dados climáticos",
		description:
			"Consulta os dados climáticos atuais de uma cidade através da WeatherAPI e armazena o resultado no PostgreSQL.",
	})
	@ApiResponse({
		status: 201,
		description: "Dados climáticos consultados e salvos com sucesso.",
		type: WeatherResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: "Dados de entrada inválidos.",
	})
	@ApiResponse({
		status: 404,
		description: "Cidade não encontrada.",
	})
	async createWeather(@Body() dto: CreateWeatherDto) {
		return this.weatherService.createWeather(dto.city);
	}

	@Get("history")
	@ApiOperation({
		summary: "Consultar histórico climático",
		description:
			"Retorna os registros climáticos armazenados no PostgreSQL utilizando paginação.",
	})
	@ApiQuery({
		name: "page",
		required: false,
		type: Number,
		example: 1,
		description: "Número da página.",
	})
	@ApiQuery({
		name: "limit",
		required: false,
		type: Number,
		example: 50,
		description: "Quantidade de registros por página. Máximo de 50.",
	})
	@ApiResponse({
		status: 200,
		description: "Histórico climático retornado com sucesso.",
	})
	@ApiResponse({
		status: 400,
		description: "Parâmetros de paginação inválidos.",
	})
	async getWeatherHistory(@Query() query: WeatherHistoryQueryDto) {
		return this.weatherService.getWeatherHistory(query.page, query.limit);
	}
}
