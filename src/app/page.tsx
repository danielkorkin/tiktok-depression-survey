import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
			<header className="bg-primary text-white py-16">
				<div className="container mx-auto px-4">
					<h1 className="text-4xl md:text-5xl font-bold mb-4 text-center dark:text-gray-900">
						TikTok and Mental Health Study
					</h1>
					<p className="text-xl md:text-2xl text-center mb-8 dark:text-gray-900">
						Investigating the relationship between TikTok usage and
						mental well-being
					</p>
					<div className="flex justify-center">
						<Button asChild size="lg" variant="secondary">
							<Link href="/participate">
								Participate in the Study
							</Link>
						</Button>
					</div>
				</div>
			</header>

			<main>
				<section className="py-16">
					<div className="container mx-auto px-4">
						<h2 className="text-3xl font-bold mb-6">
							Why Participate?
						</h2>
						<p className="text-lg mb-6">
							Your participation in this study is crucial for
							understanding the complex relationship between
							social media use and mental health. By contributing,
							you&apos;ll help researchers develop strategies to
							promote healthier online experiences.
						</p>
						<Link
							href="/why"
							className="text-primary hover:underline text-lg"
						>
							Learn more about the importance of your
							participation
						</Link>
					</div>
				</section>

				<section className="bg-white dark:bg-gray-800 py-16">
					<div className="container mx-auto px-4">
						<h2 className="text-3xl font-bold mb-6">
							Frequently Asked Questions
						</h2>
						<Accordion type="multiple" className="mb-6">
							<AccordionItem value="item-1">
								<AccordionTrigger>
									How is your privacy and information
									protected?
								</AccordionTrigger>
								<AccordionContent>
									Your information is completely anonymous and
									will not be shared. Learn more at{" "}
									<Link
										href="/guide/information-privacy"
										className="text-primary hover:underline"
									>
										Information Privacy
									</Link>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-2">
								<AccordionTrigger>
									What is this survey for?
								</AccordionTrigger>
								<AccordionContent>
									This survey is for a Science Fair project
									and Research Paper about Detecting
									Depression using Social Media. Learn more at{" "}
									<Link
										href="/guide/about"
										className="text-primary hover:underline"
									>
										Getting Started
									</Link>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						<Link
							href="/faq"
							className="text-primary hover:underline text-lg"
						>
							View all FAQs
						</Link>
					</div>
				</section>

				<section className="py-16">
					<div className="container mx-auto px-4">
						<h2 className="text-3xl font-bold mb-6">
							About the Study
						</h2>
						<p className="text-lg mb-6">
							This research is conducted by a team of
							psychologists and data scientists from leading
							universities. Our goal is to better understand how
							TikTok usage patterns correlate with various aspects
							of mental health and well-being.
						</p>
						<Link
							href="/about"
							className="text-primary hover:underline text-lg"
						>
							Learn more about our research team and methodology
						</Link>
					</div>
				</section>

				<section className="bg-white dark:bg-gray-800 py-16">
					<div className="container mx-auto px-4">
						<h2 className="text-3xl font-bold mb-6">Open Source</h2>
						<p className="text-lg mb-6">
							We believe in transparency and collaboration.
							That&apos;s why we&apos;ve made the source code for
							this study publicly available.
						</p>
						<Link
							href="https://github.com/danielkorkin/tiktok-depression-survey"
							className="text-primary hover:underline text-lg"
						>
							View the source code on GitHub
						</Link>
					</div>
				</section>
			</main>
		</div>
	);
}
