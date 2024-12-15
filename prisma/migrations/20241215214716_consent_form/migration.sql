-- CreateTable
CREATE TABLE "ConsentForm" (
    "id" SERIAL NOT NULL,
    "participantName" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "signatureDate" TIMESTAMP(3) NOT NULL,
    "isMinor" BOOLEAN NOT NULL,
    "parentName" TEXT,
    "parentSignature" TEXT,
    "parentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConsentForm_pkey" PRIMARY KEY ("id")
);
