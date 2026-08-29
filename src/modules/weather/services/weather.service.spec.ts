import { describe, expect, it, vi } from "vitest";

import { WeatherService } from "./weather.service.js";

describe("WeatherService", () => {
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
					last_updated: "2026-08-29 10:00",
				},
			}),
		};

		const savedWeather = {
			id: "weather-id",
			city: "Rio De Janeiro",
			country: "Brazil",
			temperature: 22.5,
			feelsLike: 23.9,
			humidity: 85,
			pressure: 1012,
			weather: "Partly Cloudy",
			description: "Partly Cloudy",
			windSpeed: 11.9,
		};

		const prismaService = {
			weatherRecord: {
				create: vi.fn().mockResolvedValue(savedWeather),
				findMany: vi.fn(),
				count: vi.fn(),
			},
		};

		const service = new WeatherService(
			weatherApiService as never,
			prismaService as never,
		);

		const result = await service.createWeather("Rio de Janeiro");

		expect(weatherApiService.getCurrentWeather).toHaveBeenCalledTimes(1);

		expect(weatherApiService.getCurrentWeather).toHaveBeenCalledWith(
			"Rio de Janeiro",
		);

		expect(prismaService.weatherRecord.create).toHaveBeenCalledTimes(1);

		expect(prismaService.weatherRecord.create).toHaveBeenCalledWith({
			data: {
				city: "Rio De Janeiro",
				country: "Brazil",
				latitude: -22.9,
				longitude: -43.2333,
				temperature: 22.5,
				feelsLike: 23.9,
				humidity: 85,
				pressure: 1012,
				weather: "Partly Cloudy",
				description: "Partly Cloudy",
				windSpeed: 11.9,
				recordedAt: new Date("2026-08-29 10:00"),
			},
		});

		expect(result).toEqual(savedWeather);
	});

	it("deve retornar o histórico climático com paginação", async () => {
		const weatherApiService = {
			getCurrentWeather: vi.fn(),
		};

		const history = [
			{
				id: "weather-1",
				city: "Rio De Janeiro",
				country: "Brazil",
				temperature: 22.5,
				feelsLike: 23.9,
				humidity: 85,
				pressure: 1012,
				weather: "Partly Cloudy",
				description: "Partly Cloudy",
				windSpeed: 11.9,
				recordedAt: new Date("2026-08-29T10:00:00.000Z"),
				createdAt: new Date("2026-08-29T10:00:00.000Z"),
			},
		];

		const prismaService = {
			weatherRecord: {
				create: vi.fn(),
				findMany: vi.fn().mockResolvedValue(history),
				count: vi.fn().mockResolvedValue(1),
			},
		};

		const service = new WeatherService(
			weatherApiService as never,
			prismaService as never,
		);

		const result = await service.getWeatherHistory(1, 50);

		expect(prismaService.weatherRecord.findMany).toHaveBeenCalledTimes(1);

		expect(prismaService.weatherRecord.findMany).toHaveBeenCalledWith({
			skip: 0,
			take: 50,
			orderBy: {
				recordedAt: "desc",
			},
		});

		expect(prismaService.weatherRecord.count).toHaveBeenCalledTimes(1);

		expect(result).toEqual({
			data: history,
			meta: {
				page: 1,
				limit: 50,
				total: 1,
				totalPages: 1,
			},
		});
	});

	it("deve calcular corretamente o offset da paginação", async () => {
		const weatherApiService = {
			getCurrentWeather: vi.fn(),
		};

		const prismaService = {
			weatherRecord: {
				create: vi.fn(),
				findMany: vi.fn().mockResolvedValue([]),
				count: vi.fn().mockResolvedValue(125),
			},
		};

		const service = new WeatherService(
			weatherApiService as never,
			prismaService as never,
		);

		const result = await service.getWeatherHistory(3, 50);

		expect(prismaService.weatherRecord.findMany).toHaveBeenCalledWith({
			skip: 100,
			take: 50,
			orderBy: {
				recordedAt: "desc",
			},
		});

		expect(result).toEqual({
			data: [],
			meta: {
				page: 3,
				limit: 50,
				total: 125,
				totalPages: 3,
			},
		});
	});

	it("deve utilizar os valores padrão de paginação", async () => {
		const weatherApiService = {
			getCurrentWeather: vi.fn(),
		};

		const prismaService = {
			weatherRecord: {
				create: vi.fn(),
				findMany: vi.fn().mockResolvedValue([]),
				count: vi.fn().mockResolvedValue(0),
			},
		};

		const service = new WeatherService(
			weatherApiService as never,
			prismaService as never,
		);

		const result = await service.getWeatherHistory();

		expect(prismaService.weatherRecord.findMany).toHaveBeenCalledWith({
			skip: 0,
			take: 50,
			orderBy: {
				recordedAt: "desc",
			},
		});

		expect(result).toEqual({
			data: [],
			meta: {
				page: 1,
				limit: 50,
				total: 0,
				totalPages: 0,
			},
		});
	});
});
