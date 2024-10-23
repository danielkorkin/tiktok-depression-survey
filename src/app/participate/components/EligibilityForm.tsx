"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function EligibilityForm() {
	const [usesTikTok, setUsesTikTok] = useState<string | null>(null);
	const [isEnglish, setIsEnglish] = useState<string | null>(null);
	const [isOver13, setIsOver13] = useState<string | null>(null);
	const [isOver18, setIsOver18] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [userKey, setUserKey] = useState<string | null>(null);
	const router = useRouter();

	const generateUserKey = (): string => {
		return Math.random().toString(36).substr(2, 9).toUpperCase();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validate required fields
		if (
			usesTikTok !== "true" ||
			isEnglish !== "true" ||
			isOver13 !== "true"
		) {
			setError("You are not eligible to participate.");
			return;
		}

		// Generate user key
		const key = generateUserKey();

		// Save user to the database
		try {
			const res = await fetch("/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userKey: key,
					usesTikTok: usesTikTok === "true",
					isEnglish: isEnglish === "true",
					isOver13: isOver13 === "true",
					isOver18: isOver18 === "true",
				}),
			});

			if (!res.ok) {
				throw new Error("Failed to create user.");
			}

			const data = await res.json();
			setUserKey(data.userKey);
		} catch (err) {
			setError((err as Error).message);
		}
	};

	if (userKey) {
		return (
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Eligibility Passed</CardTitle>
					<CardDescription>
						Your participation key has been generated
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Your participation key:</p>
					<div className="mt-2 p-2 bg-muted text-center font-mono rounded">
						{userKey}
					</div>
				</CardContent>
				<CardFooter>
					<p>
						Please save this key and use it to{" "}
						<Link
							href="/login"
							className="text-primary hover:underline"
						>
							log in
						</Link>{" "}
						to complete the survey.
					</p>
				</CardFooter>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Eligibility Survey</CardTitle>
				<CardDescription>
					Please answer the following questions to determine your
					eligibility.
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-6">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="space-y-2">
						<Label>Do you use TikTok? *</Label>
						<RadioGroup
							value={usesTikTok || ""}
							onValueChange={setUsesTikTok}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="true" id="tiktokYes" />
								<Label htmlFor="tiktokYes">Yes</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="false" id="tiktokNo" />
								<Label htmlFor="tiktokNo">No</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="space-y-2">
						<Label>Is your page mostly in English? *</Label>
						<RadioGroup
							value={isEnglish || ""}
							onValueChange={setIsEnglish}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="true" id="englishYes" />
								<Label htmlFor="englishYes">Yes</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="false" id="englishNo" />
								<Label htmlFor="englishNo">No</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="space-y-2">
						<Label>Are you over 13 years old? *</Label>
						<RadioGroup
							value={isOver13 || ""}
							onValueChange={setIsOver13}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="true" id="over13Yes" />
								<Label htmlFor="over13Yes">Yes</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="false" id="over13No" />
								<Label htmlFor="over13No">No</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="space-y-2">
						<Label>Are you over 18 years old?</Label>
						<RadioGroup
							value={isOver18 || ""}
							onValueChange={setIsOver18}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="true" id="over18Yes" />
								<Label htmlFor="over18Yes">Yes</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="false" id="over18No" />
								<Label htmlFor="over18No">No</Label>
							</div>
						</RadioGroup>
						<p className="text-sm text-muted-foreground">
							If you are under 18, you need approval from your
							parents to participate.
						</p>
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" className="w-full">
						Submit
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
