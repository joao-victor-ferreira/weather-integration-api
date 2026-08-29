import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class WeatherQueryDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	city!: string;
}
