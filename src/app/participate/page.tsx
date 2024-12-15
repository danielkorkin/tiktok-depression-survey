import EligibilityForm from "./components/EligibilityForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ParticipatePage() {
	const acceptingSignups = process.env.ACCEPT_SIGNUPS === "true";

	if (!acceptingSignups) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Not Accepting Submissions</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							We are currently not accepting new participants.
							Please check back later.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<EligibilityForm />
		</div>
	);
}
