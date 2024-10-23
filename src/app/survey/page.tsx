"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

const SurveyPage: React.FC = () => {
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

	// Fetch user data based on userKey
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

	// Handle changes in PHQ-9 questions
	const handlePHQ9Change = (index: number, value: number) => {
		const updatedPHQ9 = [...phq9];
		updatedPHQ9[index] = value;
		setPhq9(updatedPHQ9);
	};

	// Handle form submission
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

		// Read TikTok data as JSON
		let tiktokJson: any;
		try {
			const fileContent = await tiktokData.text();
			tiktokJson = JSON.parse(fileContent);
		} catch (err) {
			setError("Invalid TikTok data. Please upload a valid JSON file.");
			setSubmitting(false);
			return;
		}

		// Calculate PHQ-9 score
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
					agreedExtra: user.isOver18 ? null : agreedExtra,
				}),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to submit survey.");
			}

			setSuccess(
				"Survey submitted successfully. Thank you for your participation!"
			);
			// Optionally, redirect or reset form here
			// For example, redirect to a thank you page:
			// router.push("/thank-you");
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground">
				<p>Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-background text-foreground px-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-2xl p-6 bg-card rounded shadow"
			>
				<h2 className="text-2xl font-bold mb-6">PHQ-9 Survey</h2>

				{success && <p className="text-green-500 mb-4">{success}</p>}
				{error && <p className="text-red-500 mb-4">{error}</p>}

				{/* PHQ-9 Questions */}
				<div className="mb-6">
					<h3 className="text-xl font-semibold mb-4">
						Please answer the following questions:
					</h3>
					{PHQ9Questions.map((question, index) => (
						<div key={index} className="mb-4">
							<label className="block mb-2">
								{`${index + 1}. ${question}`}
							</label>
							<select
								value={phq9[index]}
								onChange={(e) =>
									handlePHQ9Change(
										index,
										parseInt(e.target.value)
									)
								}
								required
								className="w-full px-3 py-2 border rounded"
							>
								<option value={0}>Not at all</option>
								<option value={1}>Several days</option>
								<option value={2}>
									More than half the days
								</option>
								<option value={3}>Nearly every day</option>
							</select>
						</div>
					))}
				</div>

				{/* TikTok Data Upload */}
				<div className="mb-6">
					<label htmlFor="tiktokData" className="block mb-2">
						Upload TikTok Data (JSON) *
					</label>
					<input
						type="file"
						id="tiktokData"
						accept=".json"
						onChange={(e) => {
							if (e.target.files && e.target.files[0]) {
								setTiktokData(e.target.files[0]);
							}
						}}
						required
						className="w-full"
					/>
				</div>

				{/* Terms and Conditions */}
				<div className="mb-4">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={agreedTerms}
							onChange={(e) => setAgreedTerms(e.target.checked)}
							required
							className="mr-2"
						/>
						I agree to the{" "}
						<a href="/terms" className="text-blue-500 underline">
							terms and conditions
						</a>
						.
					</label>
				</div>

				{/* Additional Terms for Users Under 18 */}
				{user?.isOver18 === false && (
					<div className="mb-6">
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={agreedExtra}
								onChange={(e) =>
									setAgreedExtra(e.target.checked)
								}
								required
								className="mr-2"
							/>
							I agree to the additional terms for users under 18,
							including parental approval.
						</label>
					</div>
				)}

				<button
					type="submit"
					disabled={submitting}
					className={`w-full px-4 py-2 rounded ${
						submitting
							? "bg-gray-400 cursor-not-allowed"
							: "bg-green-600 hover:bg-green-700"
					} text-white font-semibold`}
				>
					{submitting ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
};

export default SurveyPage;
