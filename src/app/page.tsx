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
		<div className="container mx-auto px-4 py-8">
			<section className="mb-16">
				<Card className="w-full max-w-2xl mx-auto">
					<CardHeader>
						<CardTitle className="text-3xl font-bold text-center">
							Welcome to Our TikTok and Mental Health Study
						</CardTitle>
						<CardDescription className="text-center">
							We&apos;re investigating the relationship between TikTok
							usage and mental health.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-center mb-4">
							Your participation will help us understand the
							impact of social media on well-being.
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
			</section>

			<section className="mb-16">
				<h2 className="text-2xl font-bold mb-4">Why Participate?</h2>
				<p className="mb-4">
					Your participation in this study is crucial for
					understanding the complex relationship between social media
					use and mental health. By contributing, you&apos;ll help
					researchers develop strategies to promote healthier online
					experiences.
				</p>
				<Link href="/why" className="text-primary hover:underline">
					Learn more about the importance of your participation
				</Link>
			</section>

			<section className="mb-16">
				<h2 className="text-2xl font-bold mb-4">
					Frequently Asked Questions
				</h2>
				<ul className="list-disc pl-5 space-y-2">
					<li>How long will the study take?</li>
					<li>Is my data kept confidential?</li>
					<li>What are the benefits of participating?</li>
				</ul>
				<Link
					href="/faq"
					className="text-primary hover:underline block mt-4"
				>
					View all FAQs
				</Link>
			</section>

			<section className="mb-16">
				<h2 className="text-2xl font-bold mb-4">About the Study</h2>
				<p className="mb-4">
					This research is conducted by a team of psychologists and
					data scientists from leading universities. Our goal is to
					better understand how TikTok usage patterns correlate with
					various aspects of mental health and well-being.
				</p>
				<Link href="/about" className="text-primary hover:underline">
					Learn more about our research team and methodology
				</Link>
			</section>

			<section>
				<h2 className="text-2xl font-bold mb-4">Open Source</h2>
				<p className="mb-4">
					We believe in transparency and collaboration. That&apos;s why
					we&apos;ve made the source code for this study publicly
					available.
				</p>
				<Link
					href="/source-code"
					className="text-primary hover:underline"
				>
					View the source code on GitHub
				</Link>
			</section>
		</div>
	);
}
