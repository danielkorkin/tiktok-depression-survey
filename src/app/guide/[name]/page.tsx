// src/app/guide/[name]/page.tsx

import { notFound } from "next/navigation";
import { getGuideByName, getAllGuideNames, Guide } from "@/lib/guides"; // Imported getAllGuideNames
import React from "react";
import { Metadata } from "next";
import Link from "next/link";

interface GuidePageProps {
	params: {
		name: string;
	};
}

export async function generateStaticParams() {
	const guideNames = getAllGuideNames(); // Now imported
	return guideNames.map((name) => ({
		name,
	}));
}

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({
	params,
}: GuidePageProps): Promise<Metadata> {
	const guide = await getGuideByName(params.name);
	if (!guide) {
		return {
			title: "Guide Not Found",
			description: "The requested guide does not exist.",
		};
	}

	return {
		title: guide.meta.title,
		description: guide.meta.description,
		authors: [{ name: guide.meta.author }],
	};
}

export default async function GuidePage({ params }: GuidePageProps) {
	const guide = await getGuideByName(params.name);

	if (!guide) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Link
				href="/guides"
				className="text-blue-500 hover:underline mb-4 inline-block dark:text-blue-300"
			>
				&larr; Back to Guides
			</Link>
			<h1 className="text-4xl font-bold mb-4 dark:text-white">
				{guide.meta.title}
			</h1>
			<p className="text-gray-600 mb-6 dark:text-gray-300">
				By {guide.meta.author} | Created at:{" "}
				{new Date(guide.meta.createdAt).toLocaleDateString()} | Updated
				at: {new Date(guide.meta.updatedAt).toLocaleDateString()}
			</p>
			<div
				className="prose prose-lg max-w-none dark:prose-dark"
				dangerouslySetInnerHTML={{ __html: guide.content }}
			/>
		</div>
	);
}
