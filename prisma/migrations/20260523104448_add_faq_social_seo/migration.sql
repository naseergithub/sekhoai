-- CreateEnum
CREATE TYPE "SocialPostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'POSTED');

-- AlterTable
ALTER TABLE "SeoMeta" ADD COLUMN     "ogDesc" TEXT,
ADD COLUMN     "ogTitle" TEXT;

-- AlterTable
ALTER TABLE "Subtopic" ADD COLUMN     "faqData" TEXT;

-- CreateTable
CREATE TABLE "SocialPost" (
    "id" TEXT NOT NULL,
    "subtopicId" TEXT NOT NULL,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postedAt" TIMESTAMP(3),
    "status" "SocialPostStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialPost_subtopicId_key" ON "SocialPost"("subtopicId");

-- AddForeignKey
ALTER TABLE "SocialPost" ADD CONSTRAINT "SocialPost_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
