// src/app/api/surveys/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptWithPublicKey } from "@/lib/encryption";

interface SurveyRequestBody {
	userKey: string;
	phq9Score: number;
	videoList: any[];
	agreedTerms: boolean;
	agreedExtra?: boolean | null;
}

export async function POST(request: Request) {
	try {
		const body: SurveyRequestBody = await request.json();
		const { userKey, phq9Score, videoList, agreedTerms, agreedExtra } =
			body;

		// Validate required fields
		if (
			!userKey ||
			typeof phq9Score !== "number" ||
			!Array.isArray(videoList) ||
			typeof agreedTerms !== "boolean"
		) {
			return NextResponse.json(
				{ error: "Missing or invalid required fields." },
				{ status: 400 }
			);
		}

		// Find the user by userKey and include the survey relation
		const user = await prisma.user.findUnique({
			where: { userKey },
			include: { survey: true },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found." },
				{ status: 404 }
			);
		}

		// Check if the user has already submitted a survey
		if (user.survey) {
			return NextResponse.json(
				{ error: "Survey already submitted for this user." },
				{ status: 400 }
			);
		}

		// Encrypt the video list data
		const encryptedChunks = encryptWithPublicKey(videoList);

		// Create survey with encrypted data array
		const survey = await prisma.survey.create({
			data: {
				userId: user.id,
				phq9Score,
				videoList: JSON.stringify(encryptedChunks), // Store array as JSON string
				agreedTerms,
				agreedExtra,
			},
		});

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		console.error("Error submitting survey:", error);
		return NextResponse.json(
			{ error: "Internal Server Error." },
			{ status: 500 }
		);
	}
}
