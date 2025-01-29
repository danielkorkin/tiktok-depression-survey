// src/app/api/surveys/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptWithPublicKey } from "@/lib/encryption";

interface SurveyRequestBody {
	userKey: string;
	phq9Score: number;
	age: number;
	gender: string;
	videoList: any[];
	likedList: any[]; // Add new field
	agreedTerms: boolean;
	agreedExtra?: boolean | null;
	requestDate: string;
	timezone: string;
}

export async function POST(request: Request) {
	try {
		const body: SurveyRequestBody = await request.json();
		const {
			userKey,
			phq9Score,
			age,
			gender,
			videoList,
			likedList,
			agreedTerms,
			agreedExtra,
			requestDate,
			timezone,
		} = body;

		// Validate required fields
		if (
			!userKey ||
			typeof phq9Score !== "number" ||
			!Array.isArray(videoList) ||
			!Array.isArray(likedList) ||
			typeof agreedTerms !== "boolean"
		) {
			return NextResponse.json(
				{ error: "Missing or invalid required fields." },
				{ status: 400 },
			);
		}

		// Encrypt both lists
		const encryptedVideoList = encryptWithPublicKey(videoList);
		const encryptedLikedList = encryptWithPublicKey(likedList);

		// Create survey with both encrypted lists
		const survey = await prisma.survey.create({
			data: {
				userId: user.id,
				phq9Score,
				age,
				gender: gender.toLowerCase(),
				videoList: JSON.stringify(encryptedVideoList),
				likedList: JSON.stringify(encryptedLikedList),
				agreedTerms,
				agreedExtra,
				requestDate: new Date(requestDate),
				timezone,
			},
		});

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to submit survey." },
			{ status: 500 },
		);
	}
}
