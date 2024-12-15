import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Change from import { prisma }

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const consentForm = await prisma.consentForm.create({
			data: {
				participantName: body.participantName,
				signature: body.signature,
				signatureDate: new Date(body.signatureDate),
				isMinor: body.isMinor,
				parentName: body.parentName,
				parentSignature: body.parentSignature,
				parentDate: body.parentDate ? new Date(body.parentDate) : null,
				completed: true,
			},
		});

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		console.error("Error saving consent form:", error);
		return NextResponse.json(
			{ error: "Failed to save consent form" },
			{ status: 500 }
		);
	}
}
