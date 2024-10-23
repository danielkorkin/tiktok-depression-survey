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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm() {
	const [userKey, setUserKey] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

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
			router.push(`/survey?key=${data.userKey}`);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription>
					Enter your user key to access the survey
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<div className="space-y-2">
						<Label htmlFor="userKey">User Key</Label>
						<Input
							type="text"
							id="userKey"
							value={userKey}
							onChange={(e) => setUserKey(e.target.value)}
							required
							placeholder="Enter your user key"
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
					>
						{isLoading ? "Logging in..." : "Login"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
