"use client";

import { getLocalTimeZone, CalendarDate } from "@internationalized/date";
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
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon, Copy, Check } from "lucide-react";
import Link from "next/link";
import CalendarInput from "./CalendarInput"; // Import the InputDemo component

interface EligibilityFormProps {
	onSubmit?: (data: {
		userKey: string;
		usesTikTok: boolean;
		isEnglish: boolean;
		isOver13: boolean;
		isOver18: boolean;
	}) => void;
}

export default function EligibilityForm({ onSubmit }: EligibilityFormProps) {
	const [usesTikTok, setUsesTikTok] = useState<string>();
	const [isEnglish, setIsEnglish] = useState<string>();
	const [dateOfBirth, setDateOfBirth] = useState<CalendarDate | null>(null);
	const [dateInputValue, setDateInputValue] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [userKey, setUserKey] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const router = useRouter();

	const calculateAge = (dob: Date): number => {
		const today = new Date();
		const birthDate = new Date(dob);
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			age--;
		}
		return age;
	};

	const generateUserKey = (): string => {
		return Math.random().toString(36).substr(2, 9).toUpperCase();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (usesTikTok !== "true" || isEnglish !== "true" || !dateOfBirth) {
			setError("You are not eligible to participate.");
			return;
		}

		// Convert CalendarDate to JavaScript Date using toDate()
		const dateObj = dateOfBirth.toDate(getLocalTimeZone());
		const age = calculateAge(dateObj);
		const isOver13 = age > 12;
		const isOver18 = age >= 18;

		if (!isOver13) {
			setError("You must be at least 13 years old to participate.");
			return;
		}

		const key = generateUserKey();

		try {
			const res = await fetch("/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userKey: key,
					usesTikTok: usesTikTok === "true",
					isEnglish: isEnglish === "true",
					isOver13,
					isOver18,
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

	const copyToClipboard = () => {
		if (userKey) {
			navigator.clipboard.writeText(userKey);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
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
					<div className="mt-2 p-2 bg-muted text-center font-mono rounded flex justify-between items-center">
						<span>{userKey}</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={copyToClipboard}
						>
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col items-center space-y-2">
					<p className="text-center">
						Please save this key. You will need it to complete the
						survey.
					</p>
					<Button asChild className="w-full">
						<Link href="/login">Continue to Login</Link>
					</Button>
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
						<Label>Date of Birth *</Label>
						<div className="space-y-2">
							<CalendarInput
								value={dateOfBirth}
								onChange={(date: CalendarDate | null) => {
									setDateOfBirth(date);
									setDateInputValue(
										date ? date.toString() : "",
									);
								}}
							/>
						</div>
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
