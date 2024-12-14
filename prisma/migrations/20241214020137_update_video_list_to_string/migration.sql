-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userKey" TEXT NOT NULL,
    "usesTikTok" BOOLEAN NOT NULL,
    "isEnglish" BOOLEAN NOT NULL,
    "isOver13" BOOLEAN NOT NULL,
    "isOver18" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "phq9Score" INTEGER NOT NULL,
    "videoList" TEXT NOT NULL,
    "agreedTerms" BOOLEAN NOT NULL,
    "agreedExtra" BOOLEAN,
    "userId" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userKey_key" ON "User"("userKey");

-- CreateIndex
CREATE UNIQUE INDEX "Survey_userId_key" ON "Survey"("userId");

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
