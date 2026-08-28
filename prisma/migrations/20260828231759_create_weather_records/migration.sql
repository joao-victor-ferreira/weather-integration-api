-- CreateTable
CREATE TABLE "weather_records" (
    "id" UUID NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "temperature" DECIMAL(5,2) NOT NULL,
    "feelsLike" DECIMAL(5,2) NOT NULL,
    "humidity" INTEGER NOT NULL,
    "pressure" INTEGER NOT NULL,
    "weather" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "windSpeed" DECIMAL(6,2) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "weather_records_city_idx" ON "weather_records"("city");

-- CreateIndex
CREATE INDEX "weather_records_recordedAt_idx" ON "weather_records"("recordedAt");
