export default function TermsOfService() {
	return (
		<div className="min-h-screen p-8 bg-white dark:bg-gray-900">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
					Terms of Service
				</h1>
				<p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
					Last Updated: January 7, 2024
				</p>

				<div className="prose dark:prose-invert">
					<p className="text-gray-700 dark:text-gray-300">
						Welcome to our research project submission site,
						designed to collect TikTok data and PROMIS survey
						responses for AI analysis in predicting depression risk.
						By accessing or using our website, you agree to comply
						with these Terms of Service.
					</p>

					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						1. Eligibility:
					</h2>
					<ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
						<li>
							Only participants aged 13 or older may submit data.
						</li>
						<li>
							Minors (aged 13-17) must have explicit parental or
							guardian consent.
						</li>
						<li>
							Participants aged 18 or older need only agree to
							these Terms of Service.
						</li>
					</ul>

					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						2. Purpose of Data Collection:
					</h2>
					<ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
						<li>
							Data is collected for the purpose of training AI to
							predict depression risk based on TikTok data and
							PROMIS scores.
						</li>
						<li>
							Participation is voluntary, and you may withdraw at
							any time.
						</li>
					</ul>

					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						3. Data Submission Requirements:
					</h2>
					<ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
						<li>
							Submitted data must be legitimate, truthful, and
							accurately reflect responses to the PROMIS survey.
						</li>
						<li>
							TikTok data must be downloaded directly from your
							settings and remain unaltered.
						</li>
						<li>
							Consent forms must be filled out accurately and
							completely.
						</li>
					</ul>

					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						4. Privacy and Anonymity:
					</h2>
					<ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
						<li>
							All data is anonymized before submission to ensure
							privacy.
						</li>
						<li>
							Sensitive data is stripped from TikTok files before
							uploading.
						</li>
						<li>
							PROMIS scores and video data are linked only through
							anonymized datasets, making it impossible to trace
							data back to participants.
						</li>
					</ul>

					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						5. Data Usage and Security:
					</h2>
					<ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
						<li>Data is stored securely.</li>
						<li>
							It will only be used for research purposes and not
							shared with third parties.
						</li>
						<li>
							Raw data will be deleted following analysis
							completion.
						</li>
					</ul>

					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						Terms of Service for Minors (Aged 13-17):
					</h2>
					<div className="pl-6">
						<h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">
							Additional Requirements for Minors:
						</h3>
						<ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
							<li>
								Minors must have parental or guardian consent to
								participate.
							</li>
							<li>
								Both the participant and parent/guardian must
								review and sign the consent form before data
								submission.
							</li>
						</ul>

						<h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">
							Parental/Guardian Responsibility:
						</h3>
						<ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
							<li>
								Parents/guardians affirm that they understand
								the purpose and potential risks of this study.
							</li>
							<li>
								They guarantee that the minor&apos;s data is
								legitimate and survey responses are truthful.
							</li>
						</ul>
					</div>

					<h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
						Contact Information:
					</h2>
					<p className="text-gray-700 dark:text-gray-300">
						If you have any questions about these Terms of Service,
						please contact us at: daniel.d.korkin@gmail.com
					</p>
				</div>
			</div>
		</div>
	);
}
