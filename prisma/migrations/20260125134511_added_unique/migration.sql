/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `videos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "videos_videoId_key" ON "videos"("videoId");
