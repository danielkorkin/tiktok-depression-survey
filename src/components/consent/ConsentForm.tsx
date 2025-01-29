/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SignatureCanvas from "react-signature-canvas";
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
import { DateField, DateInput, DateSegment } from "react-aria-components";
import { format, parse } from "date-fns";
import {
	CalendarDate,
	getLocalTimeZone,
	parseDate,
	today,
} from "@internationalized/date";

export interface ConsentFormData {
	participantName: string;
	signature: string;
	signatureDate: CalendarDate;
	isMinor: boolean;
	parentName?: string;
	parentSignature?: string;
	parentDate?: CalendarDate;
	completed?: boolean;
}

interface ConsentFormProps {
	isMinor: boolean;
	onComplete: (data: ConsentFormData) => void;
}

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
	signatureBlock: { marginTop: 20, borderTop: 1, paddingTop: 10 },
	signatureImage: { width: 200, height: 50, marginTop: 5 },
});

const toCalendarDate = (date: Date): CalendarDate => {
	return new CalendarDate(
		date.getFullYear(),
		date.getMonth() + 1,
		date.getDate(),
	);
};

const toJSDate = (calendarDate: CalendarDate): Date => {
	return new Date(
		calendarDate.year,
		calendarDate.month - 1,
		calendarDate.day,
		12,
	);
};

const FormContent = ({ isMinor = false }: { isMinor: boolean }) => (
	<div className="space-y-4 text-sm dark:text-gray-200">
		<h3 className="font-bold dark:text-white">
			Student Researchers: Daniel Korkin, Vikram Hiranandani
		</h3>
		<h3 className="font-bold dark:text-white">
			Title of Project: Leveraging Social Media Data and AI to Predict
			Risk of Depression Using TikTok Algorithms
		</h3>

		<p className="dark:text-gray-300">
			I am asking for your voluntary participation in my science fair
			project. Please read the following information about the project. If
			you would like to participate, please sign in the appropriate area
			below.
		</p>

		<div className="space-y-2">
			<h4 className="font-semibold dark:text-white">
				Purpose of the project:
			</h4>
			<p className="dark:text-gray-300">
				The purpose of this project is to explore how TikTok video data
				and PHQ-9 scores can be used to train an AI.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold dark:text-white">
				If you participate, you will be asked to:
			</h4>
			<p className="dark:text-gray-300">
				Submit your PHQ-9 score, TikTok data downloaded from your
				settings, and a signed Informed Consent form.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold dark:text-white">
				Time required for participation:
			</h4>
			<p className="dark:text-gray-300">
				Completing the online form will take minimal time, but
				downloading TikTok data may take additional time depending on
				TikTok&apos;s response, and filling out the PHQ-9 form should
				take a few minutes.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold dark:text-white">
				Potential Risks of Study:
			</h4>
			<p className="dark:text-gray-300">
				There is minimal risk, but TikTok data may contain sensitive
				information. However, all data is anonymized, and sensitive data
				is stripped before leaving your computer.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold dark:text-white">Benefits:</h4>
			<p className="dark:text-gray-300">
				This study could contribute to the understanding of how social
				media can be used for early depression screening, potentially
				helping others in the future.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold dark:text-white">
				How confidentiality will be maintained:
			</h4>
			<p className="dark:text-gray-300">
				All personal information and PHQ-9 scores are submitted
				separately. TikTok data is anonymized, with sensitive
				information stripped before submission. TikTok video data and
				PHQ-9 scores are linked only as anonymized datasets, making it
				impossible to identify participants. Additionally, the
				project&apos;s code is open-source for transparency.
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold dark:text-white">
				Questions about this study:
			</h4>
			<p className="dark:text-gray-300">
				If you have any questions about this study, feel free to
				contact: Daniel Korkin at daniel.d.korkin@gmail.com
			</p>
		</div>

		<div className="space-y-2">
			<h4 className="font-semibold dark:text-white">
				Voluntary Participation:
			</h4>
			<p className="dark:text-gray-300">
				Participation in this study is completely voluntary. If you
				decide not to participate there will not be negative
				consequences. Please be aware that if you decide to participate,
				you may stop participating at any time and you may decide not to
				answer any specific question.
			</p>
		</div>

		<p className="font-semibold mt-4 dark:text-white">
			By signing this form I am attesting that I have read and understand
			the information above and I freely give my consent/assent to
			participate or permission for my child to participate.
		</p>
	</div>
);

const ConsentContent = ({
	isMinor,
	formData,
}: {
	isMinor: boolean;
	formData: ConsentFormData;
}) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<Text style={styles.title}>
				Student Researchers: Daniel Korkin, Vikram Hiranandani
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
				contact: Daniel Korkin at daniel.d.korkin@gmail.com
			</Text>

			<Text style={styles.heading}>Voluntary Participation:</Text>
			<Text style={styles.text}>
				Participation in this study is completely voluntary. If you
				decide not to participate there will not be negative
				consequences. Please be aware that if you decide to participate,
				you may stop participating at any time and you may decide not to
				answer any specific question.
			</Text>

			<Text style={[styles.text, { marginTop: 10, fontWeight: "bold" }]}>
				By signing this form I am attesting that I have read and
				understand the information above and I freely give my
				consent/assent to participate or permission for my child to
				participate.
			</Text>

			<View style={styles.signatureBlock}>
				<Text style={styles.heading}>
					Adult Informed Consent or Minor Assent
				</Text>
				<Text style={styles.text}>
					Research Participant Printed Name:{" "}
					{formData.participantName}
				</Text>
				{formData.signature && (
					<>
						<Text style={styles.text}>Signature:</Text>
						<Image
							source={formData.signature}
							style={styles.signatureImage}
						/>
					</>
				)}
				<Text style={styles.text}>
					Date Reviewed & Signed:{" "}
					{format(toJSDate(formData.signatureDate), "MM/dd/yyyy")}
				</Text>
			</View>

			{isMinor && (
				<View style={styles.signatureBlock}>
					<Text style={styles.heading}>
						Parental/Guardian Permission
					</Text>
					<Text style={styles.text}>
						Parent/Guardian Printed Name: {formData.parentName}
					</Text>
					{formData.parentSignature && (
						<>
							<Text style={styles.text}>Signature:</Text>
							<Image
								source={formData.parentSignature}
								style={styles.signatureImage}
							/>
						</>
					)}
					{isMinor && formData.parentDate && (
						<Text style={styles.text}>
							Parent Date Reviewed & Signed:{" "}
							{format(
								toJSDate(formData.parentDate),
								"MM/dd/yyyy",
							)}
						</Text>
					)}
				</View>
			)}
		</Page>
	</Document>
);

export function ConsentForm({ isMinor, onComplete }: ConsentFormProps) {
	const [formData, setFormData] = useState<ConsentFormData>({
		participantName: "",
		signature: "",
		signatureDate: today(getLocalTimeZone()),
		isMinor: isMinor,
		parentName: "",
		parentSignature: "",
		parentDate: isMinor ? today(getLocalTimeZone()) : undefined,
		completed: false,
	});

	const participantSigRef = useRef<SignatureCanvas>(null);
	const parentSigRef = useRef<SignatureCanvas>(null);
	const [completed, setCompleted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleComplete = () => {
		if (!formData.participantName || !participantSigRef.current) {
			setError("Please complete all required fields");
			return;
		}

		if (isMinor && !formData.parentDate) {
			setError("Parent signature date is required");
			return;
		}

		try {
			// Get signatures
			const participantSignature = participantSigRef.current
				?.getTrimmedCanvas()
				.toDataURL("image/png");

			let parentSignature;
			if (isMinor && parentSigRef.current) {
				parentSignature = parentSigRef.current
					.getTrimmedCanvas()
					.toDataURL("image/png");
			}

			// Create API submission data with converted dates
			const apiData = {
				...formData,
				signature: participantSignature,
				parentSignature,
				signatureDate: toJSDate(formData.signatureDate),
				parentDate: formData.parentDate
					? toJSDate(formData.parentDate)
					: undefined,
				completed: true,
			};

			// Keep CalendarDate for form state
			const updatedFormData: ConsentFormData = {
				...formData,
				signature: participantSignature,
				parentSignature,
				completed: true,
			};

			setFormData(updatedFormData);
			setCompleted(true);
			onComplete(apiData); // Pass converted dates to API
		} catch (err) {
			console.error("Form submission error:", err);
			setError("Failed to process form");
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<>
					<CardTitle>Informed Consent Form</CardTitle>
					<p className="text-sm text-muted-foreground mt-2">
						Note: This consent form is stored separately and not
						linked to your TikTok data or PHQ-9 responses.
					</p>
				</>
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
								ref={participantSigRef}
								canvasProps={{
									className: "w-full h-32",
									style: {
										border: "1px solid #ccc",
										backgroundColor: "#fff",
										pointerEvents: completed
											? "none"
											: "auto",
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

					<div className="space-y-2">
						<Label>Date Signed *</Label>
						<DateField
							aria-label="Date signed"
							value={formData.signatureDate}
							onChange={(date: CalendarDate | null) =>
								setFormData({
									...formData,
									signatureDate:
										date || today(getLocalTimeZone()), // Provide default date if null
								})
							}
							isDisabled={completed}
						>
							<DateInput className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
								{(segment) => <DateSegment segment={segment} />}
							</DateInput>
						</DateField>
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
												pointerEvents: completed
													? "none"
													: "auto",
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

							<div className="space-y-2">
								<Label>Parent/Guardian Date Signed *</Label>
								<DateField
									aria-label="Parent/Guardian date signed"
									isDisabled={completed}
									value={formData.parentDate}
									onChange={(date: CalendarDate | null) =>
										setFormData({
											...formData,
											parentDate:
												date ||
												today(getLocalTimeZone()),
										})
									}
								>
									<DateInput className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
										{(segment) => (
											<DateSegment segment={segment} />
										)}
									</DateInput>
								</DateField>
							</div>
						</>
					)}
				</div>

				<div className="flex justify-end space-x-2">
					{completed ? (
						<PDFDownloadLink
							document={
								<ConsentContent
									isMinor={isMinor}
									formData={formData}
								/>
							}
							fileName="consent-form.pdf"
						>
							{/*@ts-expect-error*/}
							{({
								blob,
								url,
								loading,
								error,
							}): React.ReactNode => (
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
