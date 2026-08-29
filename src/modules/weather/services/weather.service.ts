import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma/prisma.service.js";
import { WeatherApiService } from "./weather-api.service.js";

@Injectable()
export class WeatherService {
	constructor(
		private readonly weatherApiService: WeatherApiService,
		private readonly prismaService: PrismaService,
	) {}

	async getWeather(city: string) {
		return this.weatherApiService.getCurrentWeather(city);
	}

	async createWeather(city: string) {
		const weather = await this.weatherApiService.getCurrentWeather(city);

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

	async getWeatherHistory() {
		return this.prismaService.weatherRecord.findMany({
			orderBy: {
				recordedAt: "desc",
			},
		});
	}
}
