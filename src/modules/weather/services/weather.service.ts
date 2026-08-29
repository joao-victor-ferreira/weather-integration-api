import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma/prisma.service.js";
import { WeatherApiService } from "./weather-api.service.js";

@Injectable()
export class WeatherService {
	constructor(
		private readonly weatherApiService: WeatherApiService,
		private readonly prismaService: PrismaService,
	) {}

	async createWeather(city: string) {
		const weather =
			await this.weatherApiService.getCurrentWeather(city);

		return this.prismaService.weatherRecord.create({
			data: {
				city: weather.location.name,
				country: weather.location.country,

				latitude: weather.location.lat,
				longitude: weather.location.lon,

				temperature: weather.current.temp_c,
				feelsLike: weather.current.feelslike_c,

				humidity: weather.current.humidity,
				pressure: weather.current.pressure_mb,

				weather: weather.current.condition.text,
				description: weather.current.condition.text,

				windSpeed: weather.current.wind_kph,

				recordedAt: new Date(weather.current.last_updated),
			},
		});
	}

	async getWeatherHistory(page = 1, limit = 50) {
		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			this.prismaService.weatherRecord.findMany({
				skip,
				take: limit,
				orderBy: {
					recordedAt: "desc",
				},
			}),

			this.prismaService.weatherRecord.count(),
		]);

		return {
			data,
			meta: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	}
}