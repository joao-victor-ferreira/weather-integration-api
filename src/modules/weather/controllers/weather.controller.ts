import {
    Controller,
    Get,
    Query,
} from "@nestjs/common";

import type { WeatherQueryDto } from "../dto/weather-query.dto.js";
import type { WeatherService } from "../services/weather.service.js";

@Controller("weather")
export class WeatherController {
    constructor(
        private readonly weatherService: WeatherService,
    ) {}

    @Get()
    async getWeather(
        @Query() query: WeatherQueryDto,
    ) {
        return this.weatherService.getWeather(
            query.city,
        );
    }
}