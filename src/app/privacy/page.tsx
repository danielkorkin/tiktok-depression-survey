export default function PrivacyPolicy() {
	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
				Privacy Policy
			</h1>
			<p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
				Last Updated: January 29, 2024
			</p>

			<div className="space-y-6 text-gray-700 dark:text-gray-300">
				<section>
					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						1. Introduction
					</h2>
					<p>
						This Privacy Policy explains how we collect, use, and
						protect your personal information when you participate
						in the study titled &quot;Leveraging Social Media Data
						and AI to Predict Risk of Depression Using TikTok
						Algorithms&quot; (&quot;Study&quot;). We are committed
						to safeguarding your privacy and ensuring that all data
						is handled securely and ethically.
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						2. Information We Collect
					</h2>
					<ul className="list-disc pl-6">
						<li>
							PROMIS Assessment Scores: Participants voluntarily
							submit their Patient-Reported Outcomes Measurement
							Information System (PROMIS) scores.
						</li>
						<li>
							TikTok Data: Participants provide TikTok data
							downloaded from their account settings. This
							includes video lists, captions, hashtags, and audio
							transcripts, but excludes personal identifiers.
						</li>
						<li>
							Informed Consent Forms: Participants sign consent
							forms, which are stored separately from their
							submitted data to maintain anonymity.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						3. How We Use Your Information
					</h2>
					<ul className="list-disc pl-6">
						<li>
							Train an artificial intelligence model to identify
							potential depression risk patterns.
						</li>
						<li>
							Analyze behavioral and linguistic indicators of
							mental health based on TikTok activity.
						</li>
						<li>
							Ensure the accuracy and validity of our research
							findings.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						4. How We Protect Your Privacy
					</h2>
					<ul className="list-disc pl-6">
						<li>
							Client-Side Anonymization: All personally
							identifiable information is stripped from TikTok
							data before it is transmitted.
						</li>
						<li>
							Randomized Identifiers: PROMIS scores and TikTok data
							are linked only through an anonymized identifier
							that does not trace back to you.
						</li>
						<li>
							Ethical Oversight: An Institutional Review Board
							(IRB) oversees data handling to ensure compliance
							with ethical standards.
						</li>
						<li>
							Limited Data Retention: Raw data is deleted after
							the study concludes, ensuring long-term privacy
							protection.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						5. Data Confidentiality and Sharing
					</h2>
					<ul className="list-disc pl-6">
						<li>
							We do not share or sell any data to third parties.
						</li>
						<li>
							Data is only used for research purposes within this
							Study.
						</li>
						<li>
							Aggregated, anonymized insights may be published for
							scientific contributions, but no individual data
							will ever be disclosed.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						6. Your Rights and Choices
					</h2>
					<ul className="list-disc pl-6">
						<li>
							Withdraw from the Study at any time without
							consequences.
						</li>
						<li>
							Request the deletion of their submitted data before
							the study&apos;s conclusion.
						</li>
						<li>
							Decline to answer specific questions in the PROMIS
							assessment.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						7. Contact Information
					</h2>
					<p>
						If you have any questions about this Privacy Policy or
						the Study, please contact the Research Team.
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						8. Changes to This Privacy Policy
					</h2>
					<p>
						We may update this Privacy Policy periodically. Any
						significant changes will be communicated to participants
						through our official communication channels.
					</p>
				</section>
			</div>
		</div>
	);
}
