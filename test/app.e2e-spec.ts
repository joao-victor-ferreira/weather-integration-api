import { ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AppModule } from "../src/app.module.js";

describe("Weather API (e2e)", () => {
	let app: App;

	beforeEach(async () => {
		const moduleFixture: TestingModule =
			await Test.createTestingModule({
				imports: [AppModule],
			}).compile();

		const nestApp =
			moduleFixture.createNestApplication();

		nestApp.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
			}),
		);

		app = nestApp as App;

		await nestApp.init();
	});

	afterEach(async () => {
		await app.close();
	});

	describe("POST /weather", () => {
		it("deve consultar e salvar os dados climáticos", async () => {
			const response = await request(app.getHttpServer())
				.post("/weather")
				.send({
					city: "Rio de Janeiro",
				})
				.expect(201);

			expect(response.body).toHaveProperty("id");
			expect(response.body).toHaveProperty("city");
			expect(response.body).toHaveProperty("country");
			expect(response.body).toHaveProperty("latitude");
			expect(response.body).toHaveProperty("longitude");
			expect(response.body).toHaveProperty("temperature");
			expect(response.body).toHaveProperty("feelsLike");
			expect(response.body).toHaveProperty("humidity");
			expect(response.body).toHaveProperty("pressure");
			expect(response.body).toHaveProperty("weather");
			expect(response.body).toHaveProperty("description");
			expect(response.body).toHaveProperty("windSpeed");
			expect(response.body).toHaveProperty("recordedAt");

			expect(response.body.city).toBe("Rio De Janeiro");
			expect(response.body.country).toBe("Brazil");
		});

		it("deve retornar 400 quando a cidade não for informada", async () => {
			await request(app.getHttpServer())
				.post("/weather")
				.send({})
				.expect(400);
		});
	});

	describe("GET /weather/history", () => {
		it("deve retornar o histórico climático paginado", async () => {
			const response = await request(app.getHttpServer())
				.get("/weather/history")
				.query({
					page: 1,
					limit: 50,
				})
				.expect(200);

			expect(response.body).toHaveProperty("data");
			expect(response.body).toHaveProperty("meta");

			expect(Array.isArray(response.body.data)).toBe(true);

			expect(response.body.meta).toHaveProperty("page");
			expect(response.body.meta).toHaveProperty("limit");
			expect(response.body.meta).toHaveProperty("total");
			expect(response.body.meta).toHaveProperty(
				"totalPages",
			);

			expect(response.body.meta.page).toBe(1);
			expect(response.body.meta.limit).toBe(50);
		});

		it("deve aceitar parâmetros de paginação", async () => {
			const response = await request(app.getHttpServer())
				.get("/weather/history")
				.query({
					page: 2,
					limit: 10,
				})
				.expect(200);

			expect(response.body).toHaveProperty("data");
			expect(response.body).toHaveProperty("meta");

			expect(Array.isArray(response.body.data)).toBe(true);

			expect(response.body.meta.page).toBe(2);
			expect(response.body.meta.limit).toBe(10);
		});

		it("deve utilizar os valores padrão de paginação", async () => {
			const response = await request(app.getHttpServer())
				.get("/weather/history")
				.expect(200);

			expect(response.body).toHaveProperty("data");
			expect(response.body).toHaveProperty("meta");

			expect(response.body.meta.page).toBe(1);
			expect(response.body.meta.limit).toBe(50);
		});

		it("deve rejeitar limit maior que 50", async () => {
			await request(app.getHttpServer())
				.get("/weather/history")
				.query({
					page: 1,
					limit: 51,
				})
				.expect(400);
		});

		it("deve rejeitar page menor que 1", async () => {
			await request(app.getHttpServer())
				.get("/weather/history")
				.query({
					page: 0,
					limit: 10,
				})
				.expect(400);
		});
	});
});