import { describe, expect, it, vi } from "vitest";

import { WeatherService } from "./weather.service.js";

describe("WeatherService", () => {
	it("deve consultar o clima atual de uma cidade", async () => {
		const weatherApiService = {
			getCurrentWeather: vi.fn().mockResolvedValue({
				location: {
					name: "Rio De Janeiro",
					country: "Brazil",
				},
				current: {
					temp_c: 22.5,
					feelslike_c: 23.9,
					humidity: 85,
					pressure_mb: 1012,
					condition: {
						text: "Partly Cloudy",
					},
					wind_kph: 11.9,
				},
			}),
		};

		const prismaService = {
			weatherRecord: {
				create: vi.fn(),
				findMany: vi.fn(),
			},
		};

		const service = new WeatherService(
			weatherApiService as never,
			prismaService as never,
		);

		const result = await service.getWeather("Rio de Janeiro");

		expect(weatherApiService.getCurrentWeather).toHaveBeenCalledWith(
			"Rio de Janeiro",
		);

		expect(result.location.name).toBe("Rio De Janeiro");
		expect(result.current.temp_c).toBe(22.5);
	});

	it("deve consultar e salvar os dados climáticos", async () => {
		const weatherApiService = {
			getCurrentWeather: vi.fn().mockResolvedValue({
				location: {
					name: "Rio De Janeiro",
					country: "Brazil",
					lat: -22.9,
					lon: -43.2333,
				},
				current: {
					temp_c: 22.5,
					feelslike_c: 23.9,
					humidity: 85,
					pressure_mb: 1012,
					condition: {
						text: "Partly Cloudy",
					},
					wind_kph: 11.9,
				},
			}),
		};

		const savedWeather = {
			id: "weather-id",
			city: "Rio De Janeiro",
			country: "Brazil",
			temperature: "22.5",
			feelsLike: "23.9",
			humidity: 85,
			pressure: 1012,
			weather: "Partly Cloudy",
			description: "Partly Cloudy",
			windSpeed: "11.9",
		};

		const prismaService = {
			weatherRecord: {
				create: vi.fn().mockResolvedValue(savedWeather),
				findMany: vi.fn(),
			},
		};

		const service = new WeatherService(
			weatherApiService as never,
			prismaService as never,
		);

		const result = await service.createWeather("Rio de Janeiro");

		expect(weatherApiService.getCurrentWeather).toHaveBeenCalledWith(
			"Rio de Janeiro",
		);

		expect(prismaService.weatherRecord.create).toHaveBeenCalled();

		expect(result).toEqual(savedWeather);
	});

	it("deve retornar o histórico climático", async () => {
		const weatherApiService = {
			getCurrentWeather: vi.fn(),
		};

		const history = [
			{
				id: "weather-1",
				city: "Rio De Janeiro",
				country: "Brazil",
				temperature: "22.5",
				feelsLike: "23.9",
				humidity: 85,
				pressure: 1012,
				weather: "Partly Cloudy",
				description: "Partly Cloudy",
				windSpeed: "11.9",
				recordedAt: new Date(),
				createdAt: new Date(),
			},
		];

		const prismaService = {
			weatherRecord: {
				create: vi.fn(),
				findMany: vi.fn().mockResolvedValue(history),
			},
		};

		const service = new WeatherService(
			weatherApiService as never,
			prismaService as never,
		);

		const result = await service.getWeatherHistory();

		expect(prismaService.weatherRecord.findMany).toHaveBeenCalled();

		expect(result).toEqual(history);
	});
});
