import { beforeEach, describe, expect, it, vi } from "vitest";

import { WeatherController } from "./weather.controller.js";

describe("WeatherController", () => {
	let controller: WeatherController;

	const weatherService = {
		createWeather: vi.fn(),
		getWeatherHistory: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();

		controller = new WeatherController(weatherService as never);
	});

	describe("createWeather", () => {
		it("deve consultar e salvar os dados climáticos", async () => {
			const savedWeather = {
				id: "weather-id",
				city: "Rio De Janeiro",
				country: "Brazil",
				temperature: "22.5",
			};

			weatherService.createWeather.mockResolvedValue(savedWeather);

			const result = await controller.createWeather({
				city: "Rio de Janeiro",
			});

			expect(weatherService.createWeather).toHaveBeenCalledWith(
				"Rio de Janeiro",
			);

			expect(result).toEqual(savedWeather);
		});
	});

	describe("getWeatherHistory", () => {
		it("deve retornar o histórico climático com paginação", async () => {
			const history = {
				data: [
					{
						id: "weather-1",
						city: "Rio De Janeiro",
						country: "Brazil",
						temperature: "22.5",
					},
				],
				page: 1,
				limit: 50,
				total: 1,
				totalPages: 1,
			};

			weatherService.getWeatherHistory.mockResolvedValue(history);

			const result = await controller.getWeatherHistory({
				page: 1,
				limit: 50,
			});

			expect(weatherService.getWeatherHistory).toHaveBeenCalledWith(
				1,
				50,
			);

			expect(result).toEqual(history);
		});
	});
});