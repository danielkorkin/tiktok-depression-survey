// src/app/api/surveys/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface SurveyRequestBody {
	userKey: string;
	phq9Score: number;
	videoList: any[]; // Adjust the type based on your VideoList structure
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

		// Optionally, further validate the structure of videoList here

		// Find the user by userKey
		const user = await prisma.user.findUnique({
			where: { userKey },
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

		// Create the survey
		const survey = await prisma.survey.create({
			data: {
				phq9Score,
				videoList,
				agreedTerms,
				agreedExtra: user.isOver18 ? null : agreedExtra, // Store agreedExtra only if user is under 18
				user: {
					connect: { userKey },
				},
			},
		});

		return NextResponse.json(
			{ message: "Survey submitted successfully." },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error submitting survey:", error);
		return NextResponse.json(
			{ error: "Internal Server Error." },
			{ status: 500 }
		);
	}
}
