import { HttpService } from "@nestjs/axios";
import {
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosError } from "axios";
import { of, throwError } from "rxjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { WeatherApiService } from "./weather-api.service.js";

describe("WeatherApiService", () => {
	let service: WeatherApiService;
	let httpService: {
		get: ReturnType<typeof vi.fn>;
	};
	let configService: {
		getOrThrow: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		httpService = {
			get: vi.fn(),
		};

		configService = {
			getOrThrow: vi.fn((key: string) => {
				if (key === "weatherApi.apiKey") {
					return "test-api-key";
				}

				if (key === "weatherApi.baseUrl") {
					return "https://api.weatherapi.com/v1";
				}

				return undefined;
			}),
		};

		service = new WeatherApiService(
			httpService as unknown as HttpService,
			configService as unknown as ConfigService,
		);
	});

	it("deve consultar o clima atual com sucesso", async () => {
		const weatherResponse = {
			location: {
				name: "Rio De Janeiro",
				country: "Brazil",
			},
			current: {
				temp_c: 22.5,
				feelslike_c: 23.9,
				humidity: 85,
			},
		};

		httpService.get.mockReturnValue(
			of({
				data: weatherResponse,
			}),
		);

		const result = await service.getCurrentWeather("Rio de Janeiro");

		expect(httpService.get).toHaveBeenCalledWith(
			"https://api.weatherapi.com/v1/current.json",
			{
				params: {
					key: "test-api-key",
					q: "Rio de Janeiro",
					aqi: "no",
				},
			},
		);

		expect(result).toEqual(weatherResponse);
	});

	it("deve lançar UnauthorizedException quando a API retornar 401", async () => {
		const error = new AxiosError("Unauthorized", "401", undefined, undefined, {
			status: 401,
			statusText: "Unauthorized",
			headers: {},
			config: {} as never,
			data: {},
		});

		httpService.get.mockReturnValue(throwError(() => error));

		await expect(service.getCurrentWeather("Rio de Janeiro")).rejects.toThrow(
			UnauthorizedException,
		);
	});

	it("deve lançar NotFoundException quando a cidade não for encontrada", async () => {
		const error = new AxiosError("Not Found", "404", undefined, undefined, {
			status: 404,
			statusText: "Not Found",
			headers: {},
			config: {} as never,
			data: {},
		});

		httpService.get.mockReturnValue(throwError(() => error));

		await expect(
			service.getCurrentWeather("Cidade Inexistente"),
		).rejects.toThrow(NotFoundException);
	});

	it("deve lançar InternalServerErrorException para erros inesperados", async () => {
		const error = new Error("Network error");

		httpService.get.mockReturnValue(throwError(() => error));

		await expect(service.getCurrentWeather("Rio de Janeiro")).rejects.toThrow(
			InternalServerErrorException,
		);
	});
});
