"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EligibilityForm: React.FC = () => {
	const [usesTikTok, setUsesTikTok] = useState<boolean | null>(null);
	const [isEnglish, setIsEnglish] = useState<boolean | null>(null);
	const [isOver13, setIsOver13] = useState<boolean | null>(null);
	const [isOver18, setIsOver18] = useState<boolean | null>(null);
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
		if (usesTikTok !== true || isEnglish !== true || isOver13 !== true) {
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
					usesTikTok,
					isEnglish,
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

	if (userKey) {
		return (
			<div className="max-w-md p-6 bg-card rounded shadow">
				<h2 className="text-2xl font-bold mb-4">Eligibility Passed</h2>
				<p>Your participation key:</p>
				<div className="mt-2 p-2 bg-gray-100 text-center font-mono">
					{userKey}
				</div>
				<p className="mt-4">
					Please save this key and use it to{" "}
					<a href="/login" className="text-blue-500 underline">
						log in
					</a>{" "}
					to complete the survey.
				</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-md p-6 bg-card rounded shadow"
		>
			<h2 className="text-2xl font-bold mb-4">Eligibility Survey</h2>

			{error && <p className="text-red-500 mb-4">{error}</p>}

			<div className="mb-4">
				<label className="block mb-2">Do you use TikTok? *</label>
				<div className="flex items-center">
					<input
						type="radio"
						id="tiktokYes"
						name="usesTikTok"
						value="yes"
						checked={usesTikTok === true}
						onChange={() => setUsesTikTok(true)}
						required
						className="mr-2"
					/>
					<label htmlFor="tiktokYes" className="mr-4">
						Yes
					</label>

					<input
						type="radio"
						id="tiktokNo"
						name="usesTikTok"
						value="no"
						checked={usesTikTok === false}
						onChange={() => setUsesTikTok(false)}
						className="mr-2"
					/>
					<label htmlFor="tiktokNo">No</label>
				</div>
			</div>

			<div className="mb-4">
				<label className="block mb-2">
					Is your page mostly in English? *
				</label>
				<div className="flex items-center">
					<input
						type="radio"
						id="englishYes"
						name="isEnglish"
						value="yes"
						checked={isEnglish === true}
						onChange={() => setIsEnglish(true)}
						required
						className="mr-2"
					/>
					<label htmlFor="englishYes" className="mr-4">
						Yes
					</label>

					<input
						type="radio"
						id="englishNo"
						name="isEnglish"
						value="no"
						checked={isEnglish === false}
						onChange={() => setIsEnglish(false)}
						className="mr-2"
					/>
					<label htmlFor="englishNo">No</label>
				</div>
			</div>

			<div className="mb-4">
				<label className="block mb-2">
					Are you over 13 years old? *
				</label>
				<div className="flex items-center">
					<input
						type="radio"
						id="over13Yes"
						name="isOver13"
						value="yes"
						checked={isOver13 === true}
						onChange={() => setIsOver13(true)}
						required
						className="mr-2"
					/>
					<label htmlFor="over13Yes" className="mr-4">
						Yes
					</label>

					<input
						type="radio"
						id="over13No"
						name="isOver13"
						value="no"
						checked={isOver13 === false}
						onChange={() => setIsOver13(false)}
						className="mr-2"
					/>
					<label htmlFor="over13No">No</label>
				</div>
			</div>

			<div className="mb-6">
				<label className="block mb-2">Are you over 18 years old?</label>
				<div className="flex items-center">
					<input
						type="radio"
						id="over18Yes"
						name="isOver18"
						value="yes"
						checked={isOver18 === true}
						onChange={() => setIsOver18(true)}
						className="mr-2"
					/>
					<label htmlFor="over18Yes" className="mr-4">
						Yes
					</label>

					<input
						type="radio"
						id="over18No"
						name="isOver18"
						value="no"
						checked={isOver18 === false}
						onChange={() => setIsOver18(false)}
						className="mr-2"
					/>
					<label htmlFor="over18No">No</label>
				</div>
				<p className="text-sm text-gray-500 mt-1">
					If you are under 18, you need approval from your parents to
					participate.
				</p>
			</div>

			<button
				type="submit"
				className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
			>
				Submit
			</button>
		</form>
	);
};

export default EligibilityForm;
