"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const PHQ9Questions = [
	"Little interest or pleasure in doing things",
	"Feeling down, depressed, or hopeless",
	"Trouble falling or staying asleep, or sleeping too much",
	"Feeling tired or having little energy",
	"Poor appetite or overeating",
	"Feeling bad about yourself—or that you are a failure or have let yourself or your family down",
	"Trouble concentrating on things, such as reading the newspaper or watching television",
	"Moving or speaking so slowly that other people could have noticed? Or the opposite—being so fidgety or restless that you have been moving around a lot more than usual",
	"Thoughts that you would be better off dead, or thoughts of hurting yourself in some way",
];

interface UserData {
	id: number;
	userKey: string;
	isOver18: boolean | null;
}

export default function SurveyPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const userKey = searchParams.get("key");

	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [phq9, setPhq9] = useState<number[]>(Array(9).fill(0));
	const [tiktokData, setTiktokData] = useState<File | null>(null);
	const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
	const [agreedExtra, setAgreedExtra] = useState<boolean>(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState<boolean>(false);

	useEffect(() => {
		if (!userKey) {
			router.push("/login");
			return;
		}

		const fetchUser = async () => {
			try {
				const res = await fetch(`/api/users/${userKey}`);
				if (!res.ok) {
					const errorData = await res.json();
					throw new Error(
						errorData.error || "Failed to fetch user data."
					);
				}
				const data = await res.json();
				setUser(data);
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [userKey, router]);

	const handlePHQ9Change = (index: number, value: string) => {
		const updatedPHQ9 = [...phq9];
		updatedPHQ9[index] = parseInt(value);
		setPhq9(updatedPHQ9);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		if (!userKey) {
			setError("Invalid user key.");
			return;
		}

		if (!tiktokData) {
			setError("Please upload your TikTok data (JSON file).");
			return;
		}

		if (!agreedTerms) {
			setError("You must agree to the terms and conditions.");
			return;
		}

		if (user?.isOver18 === false && !agreedExtra) {
			setError(
				"You must agree to the additional terms for users under 18."
			);
			return;
		}

		setSubmitting(true);

		let tiktokJson: any;
		try {
			const fileContent = await tiktokData.text();
			tiktokJson = JSON.parse(fileContent);
		} catch (err) {
			setError("Invalid TikTok data. Please upload a valid JSON file.");
			setSubmitting(false);
			return;
		}

		const phq9Score = phq9.reduce((total, current) => total + current, 0);

		try {
			const res = await fetch("/api/surveys", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userKey,
					phq9Score,
					tiktokData: tiktokJson,
					agreedTerms,
					agreedExtra: user?.isOver18 ? null : agreedExtra,
				}),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to submit survey.");
			}

			setSuccess(
				"Survey submitted successfully. Thank you for your participation!"
			);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Alert variant="destructive">
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<Card className="w-full max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>PHQ-9 Survey</CardTitle>
					<CardDescription>
						Please answer the following questions about your mental
						health.
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-6">
						{success && (
							<Alert>
								<AlertTitle>Success</AlertTitle>
								<AlertDescription>{success}</AlertDescription>
							</Alert>
						)}
						{error && (
							<Alert variant="destructive">
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{PHQ9Questions.map((question, index) => (
							<div key={index} className="space-y-2">
								<Label htmlFor={`phq9-${index}`}>{`${
									index + 1
								}. ${question}`}</Label>
								<Select
									onValueChange={(value) =>
										handlePHQ9Change(index, value)
									}
									value={phq9[index].toString()}
								>
									<SelectTrigger id={`phq9-${index}`}>
										<SelectValue placeholder="Select an option" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="0">
											Not at all
										</SelectItem>
										<SelectItem value="1">
											Several days
										</SelectItem>
										<SelectItem value="2">
											More than half the days
										</SelectItem>
										<SelectItem value="3">
											Nearly every day
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						))}

						<div className="space-y-2">
							<Label htmlFor="tiktokData">
								Upload TikTok Data (JSON) *
							</Label>
							<Input
								id="tiktokData"
								type="file"
								accept=".json"
								onChange={(e) => {
									if (e.target.files && e.target.files[0]) {
										setTiktokData(e.target.files[0]);
									}
								}}
								required
							/>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="terms"
								checked={agreedTerms}
								onCheckedChange={(checked) =>
									setAgreedTerms(checked as boolean)
								}
							/>
							<Label htmlFor="terms">
								I agree to the{" "}
								<a
									href="/terms"
									className="text-primary hover:underline"
								>
									terms and conditions
								</a>
								.
							</Label>
						</div>

						{user?.isOver18 === false && (
							<div className="flex items-center space-x-2">
								<Checkbox
									id="extraTerms"
									checked={agreedExtra}
									onCheckedChange={(checked) =>
										setAgreedExtra(checked as boolean)
									}
								/>
								<Label htmlFor="extraTerms">
									I agree to the additional terms for users
									under 18, including parental approval.
								</Label>
							</div>
						)}
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							disabled={submitting}
							className="w-full"
						>
							{submitting ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : null}
							{submitting ? "Submitting..." : "Submit"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
