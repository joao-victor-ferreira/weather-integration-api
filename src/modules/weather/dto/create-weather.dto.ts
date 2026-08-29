import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateWeatherDto {
	@ApiProperty({
		example: "Rio de Janeiro",
		description: "Nome da cidade para consulta do clima.",
		minLength: 2,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	city!: string;
}
