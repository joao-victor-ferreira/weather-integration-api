import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateWeatherDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	city!: string;
}
