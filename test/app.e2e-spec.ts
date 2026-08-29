import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AppModule } from "../src/app.module.js";

describe("Weather API (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();

		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it("GET /weather - deve consultar o clima de uma cidade", async () => {
		const response = await request(app.getHttpServer())
			.get("/weather")
			.query({
				city: "Rio de Janeiro",
			})
			.expect(200);

		expect(response.body).toHaveProperty("location");
		expect(response.body).toHaveProperty("current");

		expect(response.body.location.name).toBe("Rio De Janeiro");
	});

	it("POST /weather - deve consultar e salvar o clima", async () => {
		const response = await request(app.getHttpServer())
			.post("/weather")
			.send({
				city: "Rio de Janeiro",
			})
			.expect(201);

		expect(response.body).toHaveProperty("id");
		expect(response.body).toHaveProperty("city");
		expect(response.body).toHaveProperty("country");
		expect(response.body).toHaveProperty("temperature");

		expect(response.body.city).toBe("Rio De Janeiro");
	});

	it("GET /weather/history - deve retornar o histórico climático", async () => {
		const response = await request(app.getHttpServer())
			.get("/weather/history")
			.expect(200);

		expect(Array.isArray(response.body)).toBe(true);
	});
});
