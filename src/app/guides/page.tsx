// src/app/guides/page.tsx

import { getAllGuideNames, getGuideByName, Guide } from "@/lib/guides";
import { Metadata } from "next";
import React from "react";
import GuideList from "@/components/GuideList";

export const metadata: Metadata = {
	title: "Guides",
	description: "Collection of guides for our study.",
};

async function GuidesPage() {
	const guideNames = getAllGuideNames();
	const guides: Guide[] = [];

	// Fetch all guides' metadata
	for (const name of guideNames) {
		const guide = await getGuideByName(name);
		if (guide) {
			guides.push(guide);
		}
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-6">Guides</h1>
			<GuideList guides={guides} />
		</div>
	);
}

export default GuidesPage;
