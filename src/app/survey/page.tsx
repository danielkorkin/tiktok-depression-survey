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

// Conversion Tables for PROMIS raw score to T-score
const adultConversionTable: { [raw: number]: { tScore: number; se: number } } =
	{
		8: { tScore: 38.2, se: 5.7 },
		9: { tScore: 44.7, se: 3.3 },
		10: { tScore: 47.5, se: 2.7 },
		11: { tScore: 49.4, se: 2.3 },
		12: { tScore: 50.9, se: 2.0 },
		13: { tScore: 52.1, se: 1.9 },
		14: { tScore: 53.2, se: 1.8 },
		15: { tScore: 54.1, se: 1.8 },
		16: { tScore: 55.1, se: 1.7 },
		17: { tScore: 55.9, se: 1.7 },
		18: { tScore: 56.8, se: 1.7 },
		19: { tScore: 57.7, se: 1.7 },
		20: { tScore: 58.5, se: 1.7 },
		21: { tScore: 59.4, se: 1.7 },
		22: { tScore: 60.3, se: 1.7 },
		23: { tScore: 61.2, se: 1.7 },
		24: { tScore: 62.1, se: 1.8 },
		25: { tScore: 63.0, se: 1.8 },
		26: { tScore: 63.9, se: 1.8 },
		27: { tScore: 64.9, se: 1.8 },
		28: { tScore: 65.8, se: 1.8 },
		29: { tScore: 66.8, se: 1.8 },
		30: { tScore: 67.7, se: 1.8 },
		31: { tScore: 68.7, se: 1.8 },
		32: { tScore: 69.7, se: 1.8 },
		33: { tScore: 70.7, se: 1.8 },
		34: { tScore: 71.7, se: 1.8 },
		35: { tScore: 72.8, se: 1.8 },
		36: { tScore: 73.9, se: 1.8 },
		37: { tScore: 75.0, se: 1.9 },
		38: { tScore: 76.4, se: 2.0 },
		39: { tScore: 78.2, se: 2.4 },
		40: { tScore: 81.3, se: 3.4 },
	};

const pediatricConversionTable: {
	[raw: number]: { tScore: number; se: number };
} = {
	8: { tScore: 35.2, se: 5.8 },
	9: { tScore: 40.4, se: 4.6 },
	10: { tScore: 43.2, se: 4.2 },
	11: { tScore: 45.5, se: 3.9 },
	12: { tScore: 47.4, se: 3.7 },
	13: { tScore: 49.1, se: 3.5 },
	14: { tScore: 50.6, se: 3.3 },
	15: { tScore: 52.0, se: 3.2 },
	16: { tScore: 53.3, se: 3.2 },
	17: { tScore: 54.5, se: 3.1 },
	18: { tScore: 55.7, se: 3.1 },
	19: { tScore: 56.8, se: 3.0 },
	20: { tScore: 57.9, se: 3.0 },
	21: { tScore: 59.0, se: 3.0 },
	22: { tScore: 60.0, se: 3.0 },
	23: { tScore: 61.1, se: 3.0 },
	24: { tScore: 62.1, se: 3.0 },
	25: { tScore: 63.1, se: 3.0 },
	26: { tScore: 64.1, se: 3.0 },
	27: { tScore: 65.1, se: 3.0 },
	28: { tScore: 66.1, se: 3.0 },
	29: { tScore: 67.2, se: 2.9 },
	30: { tScore: 68.2, se: 2.9 },
	31: { tScore: 69.3, se: 3.0 },
	32: { tScore: 70.3, se: 3.0 },
	33: { tScore: 71.4, se: 3.0 },
	34: { tScore: 72.6, se: 3.0 },
	35: { tScore: 73.8, se: 3.1 },
	36: { tScore: 75.1, se: 3.2 },
	37: { tScore: 76.5, se: 3.3 },
	38: { tScore: 78.1, se: 3.5 },
	39: { tScore: 79.9, se: 3.6 },
	40: { tScore: 82.4, se: 3.7 },
};

// Linking table from PROMIS T-score back to PHQ-9 score (the value stored in the DB)
const phq9LinkingTable: { [phq9: number]: { tScore: number; se: number } } = {
	0: { tScore: 37.4, se: 6.4 },
	1: { tScore: 42.7, se: 5.3 },
	2: { tScore: 45.9, se: 4.8 },
	3: { tScore: 48.3, se: 4.7 },
	4: { tScore: 50.5, se: 4.3 },
	5: { tScore: 52.5, se: 4.0 },
	6: { tScore: 54.2, se: 3.8 },
	7: { tScore: 55.8, se: 3.7 },
	8: { tScore: 57.2, se: 3.6 },
	9: { tScore: 58.6, se: 3.5 },
	10: { tScore: 59.9, se: 3.4 },
	11: { tScore: 61.1, se: 3.3 },
	12: { tScore: 62.3, se: 3.3 },
	13: { tScore: 63.5, se: 3.2 },
	14: { tScore: 64.7, se: 3.2 },
	15: { tScore: 65.8, se: 3.2 },
	16: { tScore: 66.9, se: 3.2 },
	17: { tScore: 68.0, se: 3.1 },
	18: { tScore: 69.2, se: 3.2 },
	19: { tScore: 70.3, se: 3.2 },
	20: { tScore: 71.5, se: 3.2 },
	21: { tScore: 72.7, se: 3.3 },
	22: { tScore: 74.0, se: 3.4 },
	23: { tScore: 75.3, se: 3.5 },
	24: { tScore: 76.7, se: 3.6 },
	25: { tScore: 78.3, se: 3.7 },
	26: { tScore: 80.0, se: 3.8 },
	27: { tScore: 82.3, se: 3.8 },
};

function convertRawToTScore(rawScore: number, isOver18: boolean): number {
	const table = isOver18 ? adultConversionTable : pediatricConversionTable;
	if (rawScore < 8) rawScore = 8;
	if (rawScore > 40) rawScore = 40;
	return table[rawScore].tScore;
}

function convertTScoreToPHQ9(tScore: number): number {
	let closestPHQ9 = 0;
	let minDiff = Infinity;
	for (const [phq9Score, { tScore: linkingTScore }] of Object.entries(
		phq9LinkingTable
	)) {
		const diff = Math.abs(tScore - linkingTScore);
		if (diff < minDiff) {
			minDiff = diff;
			closestPHQ9 = Number(phq9Score);
		}
	}
	return closestPHQ9;
}

// PROMIS Questions for Depression (each prefaced with "In the past two weeks:")
const PROMISQuestions = [
	"I felt worthless.",
	"I felt helpless.",
	"I felt depressed.",
	"I felt hopeless.",
	"I felt like a failure.",
	"I felt unhappy.",
	"I felt that I had nothing to look forward to.",
	"I felt that nothing could cheer me up.",
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
			}>;
		};
		"Like List"?: {
			ItemFavoriteList: Array<{
				date: string;
				link: string;
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
	const [promisResponses, setPromisResponses] = useState<number[]>(
		Array(PROMISQuestions.length).fill(0)
	);
	const [videoList, setVideoList] = useState<any[] | null>(null);
	const [likedList, setLikedList] = useState<any[] | null>(null);
	const [requestDate, setRequestDate] = useState<CalendarDate>(
		today(getLocalTimeZone())
	);
	const [timezone, setTimezone] = useState(
		Intl.DateTimeFormat().resolvedOptions().timeZone
	);
	const [age, setAge] = useState<number | "">("");
	const [gender, setGender] = useState<string>("");
	const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
	const [agreedExtra, setAgreedExtra] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [consentCompleted, setConsentCompleted] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>(
		{}
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

	const handlePROMISChange = (index: number, value: string) => {
		const updatedResponses = [...promisResponses];
		updatedResponses[index] = parseInt(value);
		setPromisResponses(updatedResponses);
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
				"You must agree to the additional terms for users under 18."
			);
			return;
		}

		if (!consentCompleted) {
			setError("Please complete the consent form first");
			return;
		}

		setSubmitting(true);

		// Compute raw PROMIS score
		const rawScore = promisResponses.reduce(
			(total, current) => total + current,
			0
		);
		const isAdult = user?.isOver18 === true;
		const tScore = convertRawToTScore(rawScore, isAdult);
		const finalPHQ9 = convertTScoreToPHQ9(tScore);

		try {
			const res = await fetch("/api/surveys", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userKey,
					phq9Score: finalPHQ9,
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

		setError(null);
		setFieldErrors({});

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

					const rawVideoList =
						parsedData.Activity?.["Video Browsing History"]
							?.VideoList || [];
					const rawLikedList =
						parsedData.Activity?.["Like List"]?.ItemFavoriteList ||
						[];

					const filteredVideoList = rawVideoList.filter((item) => {
						const date = new Date(item.Date);
						return date.getFullYear() === 2025;
					});

					const filteredLikedList = rawLikedList.filter((item) => {
						const date = new Date(item.date);
						return date.getFullYear() === 2025;
					});

					if (
						!Array.isArray(filteredVideoList) ||
						filteredVideoList.length === 0
					) {
						throw new Error(
							"No video data found from 2025. Please make sure you have browsing history from 2025."
						);
					}

					setVideoList(filteredVideoList);
					setLikedList(filteredLikedList);
					setError(null);
					setFieldErrors((prev) => ({
						...prev,
						videoList: undefined,
					}));
				} catch (parseError) {
					throw new Error(
						"Invalid TikTok data format. Please make sure you're uploading your TikTok data file and that it contains video history from 2025."
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
			setError(
				"Error reading file. Try using manual input method instead - you can switch to manual input above."
			);
			setVideoList(null);
			setLikedList(null);
		};

		reader.readAsText(file);
	};

	const handleManualInput = () => {
		try {
			const parsedVideoList = JSON.parse(manualVideoList);
			if (!Array.isArray(parsedVideoList)) {
				throw new Error("Video list must be an array");
			}

			if (!manualLikedList.trim()) {
				throw new Error("Liked list is required");
			}
			const parsedLikedList = JSON.parse(manualLikedList);
			if (!Array.isArray(parsedLikedList)) {
				throw new Error("Liked list must be an array");
			}

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
				videoList: undefined,
				likedList:
					"Please provide both video and liked lists in valid JSON format",
			}));
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

		promisResponses.forEach((score, index) => {
			if (score < 1 || score > 5) {
				errors[`promis-${index}`] = "Please select an option";
			}
		});

		if (uploadMethod === "automatic") {
			if (
				!videoList ||
				!Array.isArray(videoList) ||
				videoList.length === 0
			) {
				errors.videoList =
					"Please upload a valid TikTok VideoList JSON file";
			}
		}

		if (uploadMethod === "manual") {
			if (!manualVideoList.trim()) {
				errors.videoList = "Please enter your video list";
			}
			if (!manualLikedList.trim()) {
				errors.likedList = "Please enter your liked list";
			}
			try {
				if (manualVideoList) {
					JSON.parse(manualVideoList);
				}
				if (manualLikedList) {
					JSON.parse(manualLikedList);
				}
			} catch (err) {
				errors.jsonFormat = "Invalid JSON format";
			}
		}

		if (!requestDate) {
			errors.requestDate =
				"Please select when you requested your TikTok data";
		}

		if (!timezone) {
			errors.timezone =
				"Please select your primary TikTok viewing timezone";
		}

		if (!age || typeof age !== "number" || age < 13 || age > 100) {
			errors.age = "Please enter a valid age between 13 and 100";
		}

		if (
			!gender ||
			!["male", "female", "other"].includes(gender.toLowerCase())
		) {
			errors.gender = "Please select your gender";
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
					<CardTitle>PROMIS Depression Survey</CardTitle>
					<CardDescription>
						Please answer the following questions about your mental
						health in the past two weeks.
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

						{PROMISQuestions.map((question, index) => (
							<div key={index} className="space-y-2">
								<Label htmlFor={`promis-${index}`}>
									{index + 1}. In the past two weeks:{" "}
									{question}
								</Label>
								<Select
									onValueChange={(value) =>
										handlePROMISChange(index, value)
									}
									value={promisResponses[index].toString()}
								>
									<SelectTrigger
										id={`promis-${index}`}
										className={
											fieldErrors[`promis-${index}`]
												? "border-red-500"
												: ""
										}
									>
										<SelectValue placeholder="Select an option" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="5">
											Always
										</SelectItem>
										<SelectItem value="4">Often</SelectItem>
										<SelectItem value="3">
											Sometimes
										</SelectItem>
										<SelectItem value="2">
											Rarely
										</SelectItem>
										<SelectItem value="1">Never</SelectItem>
									</SelectContent>
								</Select>
								{fieldErrors[`promis-${index}`] && (
									<p className="text-red-500 text-sm">
										{fieldErrors[`promis-${index}`]}
									</p>
								)}
							</div>
						))}

						<div className="space-y-2">
							<Label>Upload Method *</Label>
							<Select
								onValueChange={(value) =>
									setUploadMethod(
										value as "automatic" | "manual"
									)
								}
								value={uploadMethod}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select upload method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="automatic">
										<div className="flex items-center gap-2">
											Automatic (Recommended)
										</div>
									</SelectItem>
									<SelectItem value="manual">
										Manual Text Entry
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
												"cursor-pointer"
											)}
										/>
										<p className="text-sm text-muted-foreground mt-1">
											Please upload your TikTok data JSON
											file
										</p>
										<a
											href="/guide/how-to-download-tiktok-data"
											className="text-primary text-sm underline mt-1 block"
										>
											How to download your TikTok data
										</a>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									{uploadMethod === "manual" && (
										<a
											href="/guide/manual-input"
											className="text-primary text-sm underline mt-1 block"
										>
											Need help with manual input? View
											our guide
										</a>
									)}
									<div className="space-y-2">
										<Label htmlFor="manualVideoList">
											Video List JSON *
										</Label>
										<Textarea
											id="manualVideoList"
											value={manualVideoList}
											onChange={(e) =>
												setManualVideoList(
													e.target.value
												)
											}
											placeholder='[{"Date": "2025-01-01 12:00:00", "Link": "https://..."}, ...]'
											className="font-mono"
											rows={10}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="manualLikedList">
											Liked List JSON *
										</Label>
										<Textarea
											id="manualLikedList"
											value={manualLikedList}
											onChange={(e) =>
												setManualLikedList(
													e.target.value
												)
											}
											placeholder='[{"date": "2025-01-01 12:00:00", "link": "https://..."}, ...]'
											className="font-mono"
											rows={10}
											required
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
										date || today(getLocalTimeZone())
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
