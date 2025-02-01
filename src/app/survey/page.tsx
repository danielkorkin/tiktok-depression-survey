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
import { DateField, DateInput, DateSegment } from "react-aria-components";
import TimezoneSelect from "@/components/ui/timezone-select";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

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

interface TikTokData {
	Activity: {
		"Video Browsing History"?: {
			VideoList: Array<{
				Date: string;
				Link: string;
				// Add other expected fields
			}>;
		};
		"Like List"?: {
			ItemFavoriteList: Array<{
				date: string;
				link: string;
				// Add other expected fields
			}>;
		};
	};
}

type UploadMethod = "automatic" | "manual";

function SurveyPageContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const userKey = searchParams.get("key");

	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [phq9, setPhq9] = useState<number[]>(Array(9).fill(0));
	const [videoList, setVideoList] = useState<any[] | null>(null);
	const [likedList, setLikedList] = useState<any[] | null>(null);
	const [requestDate, setRequestDate] = useState<CalendarDate>(
		today(getLocalTimeZone()),
	);
	const [timezone, setTimezone] = useState(
		Intl.DateTimeFormat().resolvedOptions().timeZone,
	);
	const [age, setAge] = useState<number | "">("");
	const [gender, setGender] = useState<string>("");
	const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
	const [agreedExtra, setAgreedExtra] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [consentCompleted, setConsentCompleted] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>(
		{},
	);
	const [uploadMethod, setUploadMethod] = useState<UploadMethod>("automatic");
	const [manualVideoList, setManualVideoList] = useState<string>("");
	const [manualLikedList, setManualLikedList] = useState<string>("");

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

		// Form validation
		const errors = validateForm();
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}

		// Pre-submission validation checks
		if (!userKey) {
			setError("Invalid user key.");
			return;
		}

		if (!videoList) {
			setError("Please upload your TikTok VideoList JSON file.");
			return;
		}

		if (!requestDate) {
			setError("Please select when you requested your TikTok data");
			return;
		}

		if (!timezone) {
			setError("Please select your primary TikTok viewing timezone");
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
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userKey,
					phq9Score: phq9.reduce((a, b) => a + b, 0),
					age,
					gender,
					videoList,
					likedList,
					agreedTerms,
					agreedExtra,
					requestDate: requestDate.toString(),
					timezone,
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

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (!file) {
			setError("Please select a file");
			return;
		}

		// Reset previous errors
		setError(null);
		setFieldErrors({});

		// Verify file type
		if (!file.name.endsWith(".json")) {
			setError("Please upload a JSON file (.json extension)");
			return;
		}

		const reader = new FileReader();
		reader.onload = async (event) => {
			try {
				if (!event.target?.result) {
					throw new Error("Failed to read file");
				}

				let jsonContent: string;
				if (typeof event.target.result === "string") {
					jsonContent = event.target.result.replace(/^\uFEFF/, "");
				} else {
					throw new Error("Invalid file content");
				}

				try {
					const parsedData: TikTokData = JSON.parse(jsonContent);

					// Get only video and like lists
					const rawVideoList =
						parsedData.Activity?.["Video Browsing History"]
							?.VideoList || [];
					const rawLikedList =
						parsedData.Activity?.["Like List"]?.ItemFavoriteList ||
						[];

					// Filter for 2025 data only
					const filteredVideoList = rawVideoList.filter((item) => {
						const date = new Date(item.Date);
						return date.getFullYear() === 2025;
					});

					const filteredLikedList = rawLikedList.filter((item) => {
						const date = new Date(item.date);
						return date.getFullYear() === 2025;
					});

					// Validate filtered data
					if (
						!Array.isArray(filteredVideoList) ||
						filteredVideoList.length === 0
					) {
						throw new Error(
							"No video data found from 2025. Please make sure you have browsing history from 2025.",
						);
					}

					// Update state with filtered data
					setVideoList(filteredVideoList);
					setLikedList(filteredLikedList);
					setError(null);
					setFieldErrors((prev) => ({
						...prev,
						videoList: undefined,
					}));
				} catch (parseError) {
					throw new Error(
						"Invalid TikTok data format. Please make sure you're uploading your TikTok data file and that it contains video history from 2025.",
					);
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to parse file";
				setError(`Error: ${errorMessage}`);
				setFieldErrors((prev) => ({
					...prev,
					videoList:
						"Please upload a valid TikTok data file with 2025 video history",
				}));
				setVideoList(null);
				setLikedList(null);
			}
		};

		reader.onerror = () => {
			setError("Error reading file");
			setVideoList(null);
			setLikedList(null);
		};

		reader.readAsText(file);
	};

	const handleManualInput = () => {
		try {
			// Parse and validate video list
			const parsedVideoList = JSON.parse(manualVideoList);
			if (!Array.isArray(parsedVideoList)) {
				throw new Error("Video list must be an array");
			}

			// Parse and validate liked list
			const parsedLikedList = manualLikedList
				? JSON.parse(manualLikedList)
				: [];
			if (!Array.isArray(parsedLikedList)) {
				throw new Error("Liked list must be an array");
			}

			// Filter for 2025 data only
			const filteredVideoList = parsedVideoList.filter((item) => {
				const date = new Date(item.Date);
				return date.getFullYear() === 2025;
			});

			const filteredLikedList = parsedLikedList.filter((item) => {
				const date = new Date(item.date);
				return date.getFullYear() === 2025;
			});

			if (filteredVideoList.length === 0) {
				throw new Error("No video data found from 2025");
			}

			setVideoList(filteredVideoList);
			setLikedList(filteredLikedList);
			setError(null);
			setFieldErrors((prev) => ({ ...prev, videoList: undefined }));
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Invalid JSON format";
			setError(`Error: ${errorMessage}`);
			setFieldErrors((prev) => ({
				...prev,
				videoList:
					"Please enter valid JSON data with 2025 video history",
			}));
			setVideoList(null);
			setLikedList(null);
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

		// Consent validation
		if (!consentCompleted) {
			errors.consent = "Please complete the consent form";
		}

		// PHQ9 validation
		phq9.forEach((score, index) => {
			if (score < 0 || score > 3) {
				errors[`phq9-${index}`] = "Please select an option";
			}
		});

		// VideoList validation
		if (!videoList || !Array.isArray(videoList) || videoList.length === 0) {
			errors.videoList =
				"Please upload a valid TikTok VideoList JSON file";
		}

		// Date validation
		if (!requestDate) {
			errors.requestDate =
				"Please select when you requested your TikTok data";
		}

		// Timezone validation
		if (!timezone) {
			errors.timezone =
				"Please select your primary TikTok viewing timezone";
		}

		// Age validation
		if (!age || typeof age !== "number" || age < 13 || age > 100) {
			errors.age = "Please enter a valid age between 13 and 100";
		}

		// Gender validation
		if (
			!gender ||
			!["male", "female", "other"].includes(gender.toLowerCase())
		) {
			errors.gender = "Please select your gender";
		}

		// Terms agreement validation
		if (!agreedTerms) {
			errors.terms = "Please agree to the terms and conditions";
		}

		// Extra terms for minors
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
							<Label>Upload Method *</Label>
							<Select
								onValueChange={(value: UploadMethod) =>
									setUploadMethod(value)
								}
								value={uploadMethod}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select upload method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="automatic">
										Automatic (File Upload)
									</SelectItem>
									<SelectItem value="manual">
										Manual (Paste JSON)
									</SelectItem>
								</SelectContent>
							</Select>

							{uploadMethod === "automatic" ? (
								<div className="space-y-2">
									<Label htmlFor="videoList">
										Upload VideoList JSON *
									</Label>
									<div>
										<Input
											id="videoList"
											type="file"
											accept=".json,application/json"
											onChange={handleFileUpload}
											required
											className={cn(
												fieldErrors.videoList
													? "border-red-500"
													: "",
												"cursor-pointer",
											)}
										/>
										<p className="text-sm text-muted-foreground mt-1">
											Please upload your TikTok data JSON
											file
										</p>
										<a
											href="/guide/how-to-download-tiktok-data"
											className="text-primary text-sm hover:underline mt-1 block"
										>
											How to download your TikTok data
										</a>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="manualVideoList">
											Video List JSON *
										</Label>
										<Textarea
											id="manualVideoList"
											value={manualVideoList}
											onChange={(e) =>
												setManualVideoList(
													e.target.value,
												)
											}
											placeholder='[{"Date": "2025-01-01 12:00:00", "Link": "https://..."}, ...]'
											className="font-mono"
											rows={10}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="manualLikedList">
											Liked List JSON (Optional)
										</Label>
										<Textarea
											id="manualLikedList"
											value={manualLikedList}
											onChange={(e) =>
												setManualLikedList(
													e.target.value,
												)
											}
											placeholder='[{"date": "2025-01-01 12:00:00", "link": "https://..."}, ...]'
											className="font-mono"
											rows={10}
										/>
									</div>
									<Button
										type="button"
										onClick={handleManualInput}
										variant="secondary"
									>
										Validate JSON
									</Button>
								</div>
							)}
							{fieldErrors.videoList && (
								<p className="text-red-500 text-sm">
									{fieldErrors.videoList}
								</p>
							)}
							{error && (
								<p className="text-red-500 text-sm">{error}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="requestDate">
								When did you request your TikTok data? *
							</Label>
							<DateField
								aria-label="Data request date"
								value={requestDate}
								onChange={(date: CalendarDate | null) =>
									setRequestDate(
										date || today(getLocalTimeZone()),
									)
								}
							>
								<DateInput className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
									{(segment) => (
										<DateSegment segment={segment} />
									)}
								</DateInput>
							</DateField>
							{fieldErrors.requestDate && (
								<p className="text-red-500 text-sm">
									{fieldErrors.requestDate}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="timezone">
								Your primary TikTok viewing timezone *
							</Label>
							<TimezoneSelect
								id="timezone"
								value={timezone}
								onChange={(tz) => setTimezone(tz.value)}
								className={
									fieldErrors.timezone ? "border-red-500" : ""
								}
							/>
							{fieldErrors.timezone && (
								<p className="text-red-500 text-sm">
									{fieldErrors.timezone}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="age">Age *</Label>
							<Input
								id="age"
								type="number"
								min="13"
								max="100"
								value={age}
								onChange={(e) =>
									setAge(parseInt(e.target.value) || "")
								}
								className={
									fieldErrors.age ? "border-red-500" : ""
								}
								required
							/>
							{fieldErrors.age && (
								<p className="text-red-500 text-sm">
									{fieldErrors.age}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="gender">Gender *</Label>
							<Select onValueChange={setGender} value={gender}>
								<SelectTrigger
									id="gender"
									className={
										fieldErrors.gender
											? "border-red-500"
											: ""
									}
								>
									<SelectValue placeholder="Select gender" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="male">Male</SelectItem>
									<SelectItem value="female">
										Female
									</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
							{fieldErrors.gender && (
								<p className="text-red-500 text-sm">
									{fieldErrors.gender}
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
									href="/tos"
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
