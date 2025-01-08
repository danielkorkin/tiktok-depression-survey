"use client";

import { useState, useEffect, Suspense } from "react";
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
import { ConfettiButton } from "@/components/ui/confetti";
import { ConsentForm, ConsentFormData } from "@/components/consent/ConsentForm";

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

function SurveyPageContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const userKey = searchParams.get("key");

	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [phq9, setPhq9] = useState<number[]>(Array(9).fill(0));
	const [videoList, setVideoList] = useState<any[] | null>(null);
	const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
	const [agreedExtra, setAgreedExtra] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [consentCompleted, setConsentCompleted] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>(
		{},
	);

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
						errorData.error || "Failed to fetch user data.",
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
		setFieldErrors({});

		const errors = validateForm();
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}

		if (!userKey) {
			setError("Invalid user key.");
			return;
		}

		if (!videoList) {
			setError("Please upload your TikTok VideoList JSON file.");
			return;
		}

		if (!agreedTerms) {
			setError("You must agree to the terms and conditions.");
			return;
		}

		if (user?.isOver18 === false && !agreedExtra) {
			setError(
				"You must agree to the additional terms for users under 18.",
			);
			return;
		}

		if (!consentCompleted) {
			setError("Please complete the consent form first");
			return;
		}

		setSubmitting(true);

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
					videoList,
					agreedTerms,
					agreedExtra: user?.isOver18 ? null : agreedExtra,
				}),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to submit survey.");
			}

			// Redirect to the thank you page after successful submission
			router.push("/");
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setSubmitting(false);
		}
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const json = JSON.parse(event.target?.result as string);
					const extractedVideoList =
						json?.Activity?.["Video Browsing History"]?.VideoList;
					if (Array.isArray(extractedVideoList)) {
						setVideoList(extractedVideoList);
					} else {
						throw new Error(
							"VideoList is not found or is not an array.",
						);
					}
				} catch (err) {
					setError(
						"Invalid JSON structure. Unable to extract VideoList.",
					);
				}
			};
			reader.readAsText(file);
		}
	};

	const handleConsentComplete = async (formData: ConsentFormData) => {
		try {
			const res = await fetch("/api/consent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) throw new Error("Failed to save consent form");
			setConsentCompleted(true);
		} catch (error) {
			setError((error as Error).message);
		}
	};

	const validateForm = (): { [key: string]: string } => {
		const errors: { [key: string]: string } = {};

		if (!consentCompleted) {
			errors.consent = "Please complete the consent form";
		}

		phq9.forEach((score, index) => {
			if (score < 0 || score > 3) {
				errors[`phq9-${index}`] = "Please select an option";
			}
		});

		if (!videoList || !Array.isArray(videoList) || videoList.length === 0) {
			errors.videoList =
				"Please upload a valid TikTok VideoList JSON file";
		}

		if (!agreedTerms) {
			errors.terms = "Please agree to the terms and conditions";
		}

		if (user?.isOver18 === false && !agreedExtra) {
			errors.extraTerms =
				"Please agree to the additional terms for users under 18";
		}

		return errors;
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
		<div className="container mx-auto py-10 space-y-6">
			<ConsentForm
				isMinor={user?.isOver18 === false}
				onComplete={handleConsentComplete}
			/>
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
						{fieldErrors.consent && (
							<Alert variant="destructive">
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>
									{fieldErrors.consent}
								</AlertDescription>
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
									<SelectTrigger
										id={`phq9-${index}`}
										className={
											fieldErrors[`phq9-${index}`]
												? "border-red-500"
												: ""
										}
									>
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
								{fieldErrors[`phq9-${index}`] && (
									<p className="text-red-500 text-sm">
										{fieldErrors[`phq9-${index}`]}
									</p>
								)}
							</div>
						))}

						<div className="space-y-2">
							<Label htmlFor="videoList">
								Upload VideoList JSON *
							</Label>
							<Input
								id="videoList"
								type="file"
								accept=".json"
								onChange={handleFileUpload}
								required
								className={
									fieldErrors.videoList
										? "border-red-500"
										: ""
								}
							/>
							{fieldErrors.videoList && (
								<p className="text-red-500 text-sm">
									{fieldErrors.videoList}
								</p>
							)}
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="terms"
								checked={agreedTerms}
								onCheckedChange={(checked) =>
									setAgreedTerms(checked as boolean)
								}
								className={
									fieldErrors.terms ? "border-red-500" : ""
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
						{fieldErrors.terms && (
							<p className="text-red-500 text-sm">
								{fieldErrors.terms}
							</p>
						)}

						{user?.isOver18 === false && (
							<div className="flex items-center space-x-2">
								<Checkbox
									id="extraTerms"
									checked={agreedExtra}
									onCheckedChange={(checked) =>
										setAgreedExtra(checked as boolean)
									}
									className={
										fieldErrors.extraTerms
											? "border-red-500"
											: ""
									}
								/>
								<Label htmlFor="extraTerms">
									I agree to the additional terms for users
									under 18, including parental approval.
								</Label>
								{fieldErrors.extraTerms && (
									<p className="text-red-500 text-sm">
										{fieldErrors.extraTerms}
									</p>
								)}
							</div>
						)}
					</CardContent>
					<CardFooter>
						<ConfettiButton
							type="submit"
							disabled={submitting}
							className="w-full"
						>
							{submitting ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : null}
							{submitting ? "Submitting..." : "Submit"}
						</ConfettiButton>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

export default function SurveyPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-screen">
					<Loader2 className="h-8 w-8 animate-spin" />
				</div>
			}
		>
			<SurveyPageContent />
		</Suspense>
	);
}
