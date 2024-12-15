"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SignatureCanvas from "react-signature-canvas";
import { format } from "date-fns";
import {
	pdf,
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
	page: { padding: 30 },
	title: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
	heading: {
		fontSize: 14,
		marginTop: 10,
		marginBottom: 5,
		fontWeight: "bold",
	},
	text: { fontSize: 12, marginBottom: 8 },
	signature: { marginTop: 20, borderTop: 1, paddingTop: 10 },
});

const ConsentContent = ({ isMinor }: { isMinor: boolean }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<Text style={styles.title}>
				Student Researchers: Daniel Korkin, Ayan Kataria, Vikram
				Hiranandani
			</Text>
			<Text style={styles.title}>
				Title of Project: Leveraging Social Media Data and AI to Predict
				Risk of Depression Using TikTok Algorithms
			</Text>

			<Text style={styles.text}>
				I am asking for your voluntary participation in my science fair
				project. Please read the following information about the
				project. If you would like to participate, please sign in the
				appropriate area below.
			</Text>

			<Text style={styles.heading}>Purpose of the project:</Text>
			<Text style={styles.text}>
				The purpose of this project is to explore how TikTok video data
				and PHQ-9 scores can be used to train an AI.
			</Text>

			<Text style={styles.heading}>
				If you participate, you will be asked to:
			</Text>
			<Text style={styles.text}>
				Submit your PHQ-9 score, TikTok data downloaded from your
				settings, and a signed Informed Consent form.
			</Text>

			<Text style={styles.heading}>Time required for participation:</Text>
			<Text style={styles.text}>
				Completing the online form will take minimal time, but
				downloading TikTok data may take additional time depending on
				TikTok&apos;s response, and filling out the PHQ-9 form should
				take a few minutes.
			</Text>

			<Text style={styles.heading}>Potential Risks of Study:</Text>
			<Text style={styles.text}>
				There is minimal risk, but TikTok data may contain sensitive
				information. However, all data is anonymized, and sensitive data
				is stripped before leaving your computer.
			</Text>

			<Text style={styles.heading}>Benefits:</Text>
			<Text style={styles.text}>
				This study could contribute to the understanding of how social
				media can be used for early depression screening, potentially
				helping others in the future.
			</Text>

			<Text style={styles.heading}>
				How confidentiality will be maintained:
			</Text>
			<Text style={styles.text}>
				All personal information and PHQ-9 scores are submitted
				separately. TikTok data is anonymized, with sensitive
				information stripped before submission. TikTok video data and
				PHQ-9 scores are linked only as anonymized datasets, making it
				impossible to identify participants. Additionally, the
				project&apos;s code is open-source for transparency.
			</Text>

			<Text style={styles.heading}>Questions about this study:</Text>
			<Text style={styles.text}>
				If you have any questions about this study, feel free to
				contact: Lauren Bakale at bakalel@westboroughk12.org
			</Text>

			<Text style={styles.heading}>Voluntary Participation:</Text>
			<Text style={styles.text}>
				Participation in this study is completely voluntary. If you
				decide not to participate there will not be negative
				consequences. Please be aware that if you decide to participate,
				you may stop participating at any time and you may decide not to
				answer any specific question.
			</Text>

			<Text style={styles.text}>
				By signing this form I am attesting that I have read and
				understand the information above and I freely give my
				consent/assent to participate or permission for my child to
				participate.
			</Text>

			<View style={styles.signature}>
				<Text style={styles.heading}>
					Adult Informed Consent or Minor Assent
				</Text>
				<Text style={styles.text}>
					Research Participant Printed Name: {"{participantName}"}
				</Text>
				<Text style={styles.text}>Signature: {"{signature}"}</Text>
				<Text style={styles.text}>
					Date Reviewed & Signed: {"{signatureDate}"}
				</Text>
			</View>

			{isMinor && (
				<View style={styles.signature}>
					<Text style={styles.heading}>
						Parental/Guardian Permission
					</Text>
					<Text style={styles.text}>
						Parent/Guardian Printed Name: {"{parentName}"}
					</Text>
					<Text style={styles.text}>
						Signature: {"{parentSignature}"}
					</Text>
					<Text style={styles.text}>
						Date Reviewed & Signed: {"{parentDate}"}
					</Text>
				</View>
			)}
		</Page>
	</Document>
);

const FormContent = ({ isMinor = false }) => (
	<div className="space-y-4 text-sm">
		<h3 className="font-bold">
			Student Researchers: Daniel Korkin, Ayan Kataria, Vikram Hiranandani
		</h3>
		<h3 className="font-bold">
			Title of Project: Leveraging Social Media Data and AI to Predict
			Risk of Depression Using TikTok Algorithms
		</h3>

		<p>
			I am asking for your voluntary participation in my science fair
			project. Please read the following information about the project. If
			you would like to participate, please sign in the appropriate area
			below.
		</p>

		<div className="space-y-2">
			<h4 className="font-semibold">Purpose of the project:</h4>
			<p>
				The purpose of this project is to explore how TikTok video data
				and PHQ-9 scores can be used to train an AI.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold">
				If you participate, you will be asked to:
			</h4>
			<p>
				Submit your PHQ-9 score, TikTok data downloaded from your
				settings, and a signed Informed Consent form.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold">Time required for participation:</h4>
			<p>
				Completing the online form will take minimal time, but
				downloading TikTok data may take additional time depending on
				TikTok&apos;s response, and filling out the PHQ-9 form should
				take a few minutes.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold">Potential Risks of Study:</h4>
			<p>
				There is minimal risk, but TikTok data may contain sensitive
				information. However, all data is anonymized, and sensitive data
				is stripped before leaving your computer.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold">Benefits:</h4>
			<p>
				This study could contribute to the understanding of how social
				media can be used for early depression screening, potentially
				helping others in the future.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold">
				How confidentiality will be maintained:
			</h4>
			<p>
				All personal information and PHQ-9 scores are submitted
				separately. TikTok data is anonymized, with sensitive
				information stripped before submission. TikTok video data and
				PHQ-9 scores are linked only as anonymized datasets, making it
				impossible to identify participants. Additionally, the
				project&apos;s code is open-source for transparency.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold">Questions about this study:</h4>
			<p>
				If you have any questions about this study, feel free to
				contact: Lauren Bakale at bakalel@westboroughk12.org
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold">Voluntary Participation:</h4>
			<p>
				Participation in this study is completely voluntary. If you
				decide not to participate there will not be negative
				consequences. Please be aware that if you decide to participate,
				you may stop participating at any time and you may decide not to
				answer any specific question.
			</p>
		</div>

		<p className="font-semibold mt-4">
			By signing this form I am attesting that I have read and understand
			the information above and I freely give my consent/assent to
			participate or permission for my child to participate.
		</p>
	</div>
);

export function ConsentForm({ isMinor, onComplete }: ConsentFormProps) {
	const [formData, setFormData] = useState<ConsentFormData>({
		participantName: "",
		signature: "",
		signatureDate: new Date(),
		isMinor,
		parentName: "",
		parentSignature: "",
		parentDate: isMinor ? new Date() : undefined,
	});

	const [participantSig, setParticipantSig] =
		useState<SignatureCanvas | null>(null);
	const [parentSig, setParentSig] = useState<SignatureCanvas | null>(null);
	const [completed, setCompleted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleComplete = () => {
		if (!formData.participantName || !participantSig) {
			setError("Please complete all required fields");
			return;
		}

		if (isMinor && (!formData.parentName || !parentSig)) {
			setError("Please complete all parent/guardian fields");
			return;
		}

		const data = {
			...formData,
			signature: participantSig.toDataURL(),
			parentSignature:
				isMinor && parentSig ? parentSig.toDataURL() : undefined,
		};

		setCompleted(true);
		onComplete(data);
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Informed Consent Form</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="prose max-w-none">
					<FormContent isMinor={isMinor} />
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label>Participant Name *</Label>
						<Input
							required
							disabled={completed}
							value={formData.participantName}
							onChange={(e) =>
								setFormData({
									...formData,
									participantName: e.target.value,
								})
							}
						/>
					</div>

					<div className="space-y-2">
						<Label>Participant Signature *</Label>
						<div className="border rounded-md p-2 bg-white">
							<SignatureCanvas
								ref={(ref) => setParticipantSig(ref)}
								canvasProps={{ className: "w-full h-32" }}
							/>
						</div>
						{!completed && (
							<Button
								type="button"
								variant="outline"
								onClick={() => participantSig?.clear()}
							>
								Clear
							</Button>
						)}
					</div>

					<div className="space-y-2">
						<Label>Date Signed *</Label>
						<Calendar
							mode="single"
							selected={formData.signatureDate}
							onSelect={(date) =>
								date &&
								setFormData({
									...formData,
									signatureDate: date,
								})
							}
							disabled={completed}
						/>
					</div>

					{isMinor && (
						<>
							<div className="space-y-2">
								<Label>Parent/Guardian Name *</Label>
								<Input
									required
									disabled={completed}
									value={formData.parentName}
									onChange={(e) =>
										setFormData({
											...formData,
											parentName: e.target.value,
										})
									}
								/>
							</div>

							<div className="space-y-2">
								<Label>Parent/Guardian Signature *</Label>
								<div className="border rounded-md p-2 bg-white">
									<SignatureCanvas
										ref={(ref) => setParentSig(ref)}
										canvasProps={{
											className: "w-full h-32",
										}}
									/>
								</div>
								{!completed && (
									<Button
										type="button"
										variant="outline"
										onClick={() => parentSig?.clear()}
									>
										Clear
									</Button>
								)}
							</div>

							<div className="space-y-2">
								<Label>Parent/Guardian Date Signed *</Label>
								<Calendar
									mode="single"
									selected={formData.parentDate}
									onSelect={(date) =>
										date &&
										setFormData({
											...formData,
											parentDate: date,
										})
									}
									disabled={completed}
								/>
							</div>
						</>
					)}
				</div>

				<div className="flex justify-end space-x-2">
					{completed ? (
						<PDFDownloadLink
							document={<ConsentContent isMinor={isMinor} />}
							fileName="consent-form.pdf"
						>
							{({ loading }) => (
								<Button disabled={loading}>
									{loading ? "Preparing..." : "Download PDF"}
								</Button>
							)}
						</PDFDownloadLink>
					) : (
						<Button onClick={handleComplete}>Complete Form</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
