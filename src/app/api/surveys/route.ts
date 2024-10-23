import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

interface SubmitSurveyBody {
	userKey: string;
	phq9Score: number;
	tiktokData: any;
	agreedTerms: boolean;
	agreedExtra: boolean | null;
}

export async function POST(request: Request) {
	const body: SubmitSurveyBody = await request.json();

	try {
		const user = await prisma.user.findUnique({
			where: { userKey: body.userKey },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found." },
				{ status: 404 }
			);
		}

		if (user.survey) {
			return NextResponse.json(
				{ error: "Survey already completed." },
				{ status: 400 }
			);
		}

		const survey = await prisma.survey.create({
			data: {
				phq9Score: body.phq9Score,
				tiktokData: body.tiktokData,
				agreedTerms: body.agreedTerms,
				agreedExtra: body.agreedExtra,
				user: { connect: { id: user.id } },
			},
		});

		return NextResponse.json(
			{ message: "Survey submitted successfully." },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to submit survey." },
			{ status: 500 }
		);
	}
}
