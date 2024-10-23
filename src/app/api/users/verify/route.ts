import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

interface VerifyUserBody {
	userKey: string;
}

export async function POST(request: Request) {
	const body: VerifyUserBody = await request.json();

	try {
		const user = await prisma.user.findUnique({
			where: { userKey: body.userKey },
			include: { survey: true },
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

		return NextResponse.json({ userKey: user.userKey }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to verify user." },
			{ status: 500 }
		);
	}
}
