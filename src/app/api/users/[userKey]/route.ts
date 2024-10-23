import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
	request: Request,
	{ params }: { params: { userKey: string } }
) {
	const { userKey } = params;

	try {
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

		if (user.survey) {
			return NextResponse.json(
				{ error: "Survey already completed." },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				id: user.id,
				userKey: user.userKey,
				isOver18: user.isOver18,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch user." },
			{ status: 500 }
		);
	}
}
