"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
	const [userKey, setUserKey] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		try {
			const res = await fetch(`/api/users/verify`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userKey }),
			});

			if (!res.ok) {
				throw new Error("Invalid user key.");
			}

			const data = await res.json();
			// Redirect to the survey page with userKey as a query parameter
			router.push(`/survey?key=${data.userKey}`);
		} catch (err) {
			setError((err as Error).message);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-md p-6 bg-card rounded shadow"
		>
			<h2 className="text-2xl font-bold mb-4">Login with Your Key</h2>

			{error && <p className="text-red-500 mb-4">{error}</p>}

			<div className="mb-4">
				<label htmlFor="userKey" className="block mb-2">
					User Key
				</label>
				<input
					type="text"
					id="userKey"
					value={userKey}
					onChange={(e) => setUserKey(e.target.value)}
					required
					className="w-full px-3 py-2 border rounded"
				/>
			</div>

			<button
				type="submit"
				className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
			>
				Login
			</button>
		</form>
	);
};

export default LoginForm;
