import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen py-2 px-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-center">
						Welcome to Our Study
					</CardTitle>
					<CardDescription className="text-center">
						We&apos;re investigating the relationship between TikTok
						usage and mental health.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-center mb-4">
						Your participation will help us understand the impact of
						social media on well-being.
					</p>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button asChild>
						<Link href="/participate">
							Participate in the Study
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
