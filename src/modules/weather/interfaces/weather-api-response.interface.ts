export interface WeatherApiResponse {
	location: {
		name: string;
		region: string;
		country: string;
		lat: number;
		lon: number;
		localtime: string;
	};

	current: {
		last_updated: string;
		temp_c: number;
		feelslike_c: number;
		humidity: number;
		pressure_mb: number;
		wind_kph: number;

		condition: {
			text: string;
			icon: string;
			code: number;
		};
	};
}
