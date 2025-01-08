import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

interface CreateUserBody {
	userKey: string;
	usesTikTok: boolean;
	isEnglish: boolean;
	isOver13: boolean;
	isOver18: boolean | null;
}

export async function POST(request: Request) {
	const body: CreateUserBody = await request.json();

	try {
		const user = await prisma.user.create({
			data: {
				userKey: body.userKey,
				usesTikTok: body.usesTikTok,
				isEnglish: body.isEnglish,
				isOver13: body.isOver13,
				isOver18: body.isOver18,
			},
		});

		return NextResponse.json({ userKey: user.userKey }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create user." },
			{ status: 500 },
		);
	}
}
