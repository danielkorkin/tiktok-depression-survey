"use client";

import { useState, useRef } from "react";
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
	Image,
} from "@react-pdf/renderer";

interface ConsentFormData {
	participantName: string;
	signature: string;
	signatureDate: Date;
	isMinor: boolean;
	parentName?: string;
	parentSignature?: string;
	parentDate?: Date;
}

const styles = StyleSheet.create({
	page: { padding: 30 },
	title: { fontSize: 16, marginBottom: 10 },
	heading: { fontSize: 14, marginBottom: 10, fontWeight: "bold" },
	text: { fontSize: 12, marginBottom: 5 },
	signature: { marginTop: 20 },
	signatureContainer: { height: 50, marginVertical: 10 },
	signatureImage: { width: 200, height: 50 },
});

export function ConsentForm({
	isMinor,
	onComplete,
}: {
	isMinor: boolean;
	onComplete: (data: ConsentFormData) => void;
}) {
	const [formData, setFormData] = useState<ConsentFormData>({
		participantName: "",
		signature: "",
		signatureDate: new Date(),
		isMinor,
		parentName: "",
		parentSignature: "",
		parentDate: isMinor ? new Date() : undefined,
	});

	const participantSigRef = useRef<SignatureCanvas>(null);
	const parentSigRef = useRef<SignatureCanvas>(null);
	const [completed, setCompleted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleComplete = async () => {
		if (!formData.participantName || !participantSigRef.current) {
			setError("Please complete all required fields");
			return;
		}

		try {
			// Get participant signature
			const participantSignature = participantSigRef.current
				.getTrimmedCanvas()
				.toDataURL("image/png");

			// Get parent signature if needed
			let parentSignature;
			if (isMinor && parentSigRef.current) {
				parentSignature = parentSigRef.current
					.getTrimmedCanvas()
					.toDataURL("image/png");
			}

			const updatedData = {
				...formData,
				signature: participantSignature,
				parentSignature: parentSignature,
			};

			setFormData(updatedData);
			setCompleted(true);
			onComplete(updatedData);
		} catch (err) {
			console.error("Signature capture error:", err);
			setError("Failed to process signatures");
		}
	};

	const ConsentContent = ({ formData }: { formData: ConsentFormData }) => (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.signature}>
					<Text style={styles.heading}>
						Adult Informed Consent or Minor Assent
					</Text>
					<Text style={styles.text}>
						Research Participant Name: {formData.participantName}
					</Text>
					{formData.signature && (
						<View style={styles.signatureContainer}>
							<Image
								source={formData.signature}
								style={styles.signatureImage}
							/>
						</View>
					)}
				</View>

				{isMinor && formData.parentSignature && (
					<View style={styles.signature}>
						<Text style={styles.heading}>
							Parental/Guardian Permission
						</Text>
						<Text style={styles.text}>
							Parent/Guardian Name: {formData.parentName}
						</Text>
						<View style={styles.signatureContainer}>
							<Image
								source={formData.parentSignature}
								style={styles.signatureImage}
							/>
						</View>
					</View>
				)}
			</Page>
		</Document>
	);

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Consent Form</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

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
								ref={participantSigRef}
								canvasProps={{
									className: "w-full h-32",
									style: {
										border: "1px solid #ccc",
										backgroundColor: "#fff",
									},
								}}
							/>
						</div>
						{!completed && (
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									participantSigRef.current?.clear()
								}
							>
								Clear
							</Button>
						)}
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
										ref={parentSigRef}
										canvasProps={{
											className: "w-full h-32",
											style: {
												border: "1px solid #ccc",
												backgroundColor: "#fff",
											},
										}}
									/>
								</div>
								{!completed && (
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											parentSigRef.current?.clear()
										}
									>
										Clear
									</Button>
								)}
							</div>
						</>
					)}
				</div>

				<div className="flex justify-end space-x-2">
					{completed ? (
						<PDFDownloadLink
							document={<ConsentContent formData={formData} />}
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
