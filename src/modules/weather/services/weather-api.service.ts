import { HttpService } from "@nestjs/axios";
import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { firstValueFrom } from "rxjs";

import { WeatherApiResponse } from "../interfaces/weather-api-response.interface.js";

@Injectable()
export class WeatherApiService {
	private readonly apiKey: string;
	private readonly baseUrl: string;

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {
		this.apiKey = this.configService.getOrThrow<string>("weatherApi.apiKey");
		this.baseUrl = this.configService.getOrThrow<string>("weatherApi.baseUrl");

		axiosRetry(this.httpService.axiosRef, {
			retries: 3,
			retryDelay: axiosRetry.exponentialDelay,
			retryCondition: (error) => {
				return (
					axiosRetry.isNetworkOrIdempotentRequestError(error) ||
					error.code === "ECONNABORTED" ||
					error.code === "ETIMEDOUT" ||
					(error.response?.status !== undefined && error.response.status >= 500)
				);
			},
		});
	}

	async getCurrentWeather(city: string): Promise<WeatherApiResponse> {
		try {
			const response = await firstValueFrom(
				this.httpService.get<WeatherApiResponse>(
					`${this.baseUrl}/current.json`,
					{
						params: {
							key: this.apiKey,
							q: city,
							aqi: "no",
						},
						timeout: 5000,
					},
				),
			);

			return response.data;
		} catch (error) {
			this.handleApiError(error);
		}
	}

	private handleApiError(error: unknown): never {
		if (error instanceof AxiosError) {
			const status = error.response?.status;

			if (status === 401) {
				throw new UnauthorizedException("Weather API authentication failed");
			}

			if (status === 404) {
				throw new NotFoundException("City not found");
			}
		}

		throw new InternalServerErrorException("Unable to retrieve weather data");
	}
}
