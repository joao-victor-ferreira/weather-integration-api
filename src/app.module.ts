import { Module } from "@nestjs/common";

import { WeatherModule } from "./modules/weather/weather.module.js";

@Module({
    imports: [WeatherModule],
})
export class AppModule {}