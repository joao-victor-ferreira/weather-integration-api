import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateWeatherDto {
	@ApiProperty({
		example: "Rio de Janeiro",
		description: "Nome da cidade para consulta do clima.",
		minLength: 2,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(100)
	city!: string;
}
