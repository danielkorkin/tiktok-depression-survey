"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, useInView, useAnimation } from "framer-motion";
import { ArrowRight, Brain, Lock, Users } from "lucide-react";

const AnimatedSection = ({ children }) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });
	const mainControls = useAnimation();

	useEffect(() => {
		if (isInView) {
			mainControls.start("visible");
		}
	}, [isInView, mainControls]); // Added mainControls to dependencies

	return (
		<motion.div
			ref={ref}
			variants={{
				hidden: { opacity: 0, y: 75 },
				visible: { opacity: 1, y: 0 },
			}}
			initial="hidden"
			animate={mainControls}
			transition={{ duration: 0.5, delay: 0.25 }}
		>
			{children}
		</motion.div>
	);
};

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
			<header className="bg-primary text-white py-24">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="text-5xl md:text-6xl font-bold mb-4 text-center dark:text-gray-900">
							TikTok and Mental Health Study
						</h1>
						<p className="text-xl md:text-2xl text-center mb-8 dark:text-gray-900">
							Investigating the relationship between TikTok usage
							and mental well-being
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className="flex justify-center"
					>
						<Button
							asChild
							size="lg"
							variant="secondary"
							className="text-lg"
						>
							<Link href="/participate">
								Participate in the Study{" "}
								<ArrowRight className="ml-2" />
							</Link>
						</Button>
					</motion.div>
				</div>
			</header>

			<main className="py-16">
				<AnimatedSection>
					<section className="container mx-auto px-4 mb-16">
						<h2 className="text-3xl font-bold mb-6">
							Why Participate?
						</h2>
						<div className="grid md:grid-cols-3 gap-8">
							<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
								<Brain className="w-12 h-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-2">
									Advance Science
								</h3>
								<p>
									Contribute to groundbreaking research on
									social media&apos;s impact on mental health.
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
								<Users className="w-12 h-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-2">
									Help Others
								</h3>
								<p>
									Your participation aids in developing
									strategies for healthier online experiences.
								</p>
							</div>
							<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
								<Lock className="w-12 h-12 text-primary mb-4" />
								<h3 className="text-xl font-semibold mb-2">
									Secure & Anonymous
								</h3>
								<p>
									Your data is protected and your
									participation is completely anonymous.
								</p>
							</div>
						</div>
					</section>
				</AnimatedSection>

				<AnimatedSection>
					<section className="bg-gray-100 dark:bg-gray-800 py-16">
						<div className="container mx-auto px-4">
							<h2 className="text-3xl font-bold mb-6">
								Frequently Asked Questions
							</h2>
							<Accordion
								type="single"
								collapsible
								className="mb-6"
							>
								<AccordionItem value="item-1">
									<AccordionTrigger>
										How is your privacy and information
										protected?
									</AccordionTrigger>
									<AccordionContent>
										Your information is completely anonymous
										and will not be shared. Learn more at{" "}
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
										This survey is for a Science Fair
										project and Research Paper about
										Detecting Depression using Social Media.
										Learn more at{" "}
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
								href="/guides"
								className="text-primary hover:underline text-lg flex items-center"
							>
								View more FAQs <ArrowRight className="ml-2" />
							</Link>
						</div>
					</section>
				</AnimatedSection>

				<AnimatedSection>
					<section className="container mx-auto px-4 py-16">
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
							className="text-primary hover:underline text-lg flex items-center"
						>
							Learn more about our research team and methodology{" "}
							<ArrowRight className="ml-2" />
						</Link>
					</section>
				</AnimatedSection>

				<AnimatedSection>
					<section className="bg-gray-100 dark:bg-gray-800 py-16">
						<div className="container mx-auto px-4">
							<h2 className="text-3xl font-bold mb-6">
								Open Source
							</h2>
							<p className="text-lg mb-6">
								We believe in transparency and collaboration.
								That&apos;s why we&apos;ve made the source code for this
								study publicly available.
							</p>
							<Link
								href="https://github.com/danielkorkin/tiktok-depression-survey"
								className="text-primary hover:underline text-lg flex items-center"
							>
								View the source code on GitHub{" "}
								<ArrowRight className="ml-2" />
							</Link>
						</div>
					</section>
				</AnimatedSection>
			</main>
		</div>
	);
}
