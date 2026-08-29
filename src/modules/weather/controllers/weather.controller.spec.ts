import { beforeEach, describe, expect, it, vi } from "vitest";

import { WeatherController } from "./weather.controller.js";

describe("WeatherController", () => {
	let controller: WeatherController;

	const weatherService = {
		getWeather: vi.fn(),
		createWeather: vi.fn(),
		getWeatherHistory: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();

		controller = new WeatherController(weatherService as never);
	});

	describe("getWeather", () => {
		it("deve consultar o clima de uma cidade", async () => {
			const weather = {
				location: {
					name: "Rio De Janeiro",
					country: "Brazil",
				},
				current: {
					temp_c: 22.5,
					feelslike_c: 23.9,
				},
			};

			weatherService.getWeather.mockResolvedValue(weather);

			const result = await controller.getWeather({
				city: "Rio de Janeiro",
			});

			expect(weatherService.getWeather).toHaveBeenCalledWith("Rio de Janeiro");

			expect(result).toEqual(weather);
		});
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
		it("deve retornar o histórico climático", async () => {
			const history = [
				{
					id: "weather-1",
					city: "Rio De Janeiro",
					country: "Brazil",
					temperature: "22.5",
				},
			];

			weatherService.getWeatherHistory.mockResolvedValue(history);

			const result = await controller.getWeatherHistory();

			expect(weatherService.getWeatherHistory).toHaveBeenCalled();

			expect(result).toEqual(history);
		});
	});
});
