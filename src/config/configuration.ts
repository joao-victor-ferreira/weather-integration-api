export default () => ({
	weatherApi: {
		apiKey: process.env.WEATHER_API_KEY,
		baseUrl: process.env.WEATHER_API_BASE_URL,
	},

	database: {
		url: process.env.DATABASE_URL,
	},
});
