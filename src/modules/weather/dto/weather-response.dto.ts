import { ApiProperty } from "@nestjs/swagger";

export class WeatherResponseDto {
	@ApiProperty({
		example: "0f29664a-6ee1-4070-9e09-e0ed24622575",
	})
	id!: string;

	@ApiProperty({
		example: "Rio De Janeiro",
	})
	city!: string;

	@ApiProperty({
		example: "Brazil",
	})
	country!: string;

	@ApiProperty({
		example: "-22.900000",
	})
	latitude!: string;

	@ApiProperty({
		example: "-43.233300",
	})
	longitude!: string;

	@ApiProperty({
		example: "22.50",
	})
	temperature!: string;

	@ApiProperty({
		example: "23.90",
	})
	feelsLike!: string;

	@ApiProperty({
		example: 85,
	})
	humidity!: number;

	@ApiProperty({
		example: 1012,
	})
	pressure!: number;

	@ApiProperty({
		example: "Partly Cloudy",
	})
	weather!: string;

	@ApiProperty({
		example: "Partly Cloudy",
	})
	description!: string;

	@ApiProperty({
		example: "11.90",
	})
	windSpeed!: string;

	@ApiProperty({
		example: "2026-08-29T00:45:00.000Z",
	})
	recordedAt!: string;

	@ApiProperty({
		example: "2026-08-29T00:54:59.570Z",
	})
	createdAt!: string;
}
