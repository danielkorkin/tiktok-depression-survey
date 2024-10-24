// src/components/GuideList.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Guide } from "@/lib/guides";

interface GuideListProps {
	guides: Guide[];
}

const GuideList: React.FC<GuideListProps> = ({ guides }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredGuides, setFilteredGuides] = useState<Guide[]>(guides);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (searchQuery.trim() === "") {
				setFilteredGuides(guides);
			} else {
				const lowerQuery = searchQuery.toLowerCase();
				setFilteredGuides(
					guides.filter(
						(guide) =>
							guide.meta.title
								.toLowerCase()
								.includes(lowerQuery) ||
							guide.meta.description
								.toLowerCase()
								.includes(lowerQuery) ||
							guide.meta.author.toLowerCase().includes(lowerQuery)
					)
				);
			}
		}, 300); // Debounce by 300ms

		return () => clearTimeout(timeoutId);
	}, [searchQuery, guides]);

	return (
		<div>
			<input
				type="text"
				placeholder="Search guides..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="mb-6 p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
			/>
			<ul className="space-y-4">
				{filteredGuides.map((guide) => (
					<li key={guide.name} className="border-b pb-4">
						<Link href={`/guide/${encodeURIComponent(guide.name)}`}>
							<h2 className="text-2xl font-semibold text-primary hover:underline">
								{guide.meta.title}
							</h2>
						</Link>
						<p className="text-gray-600 dark:text-gray-300">
							{guide.meta.description}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							By {guide.meta.author} | Created at:{" "}
							{new Date(
								guide.meta.createdAt
							).toLocaleDateString()}{" "}
							| Updated at:{" "}
							{new Date(
								guide.meta.updatedAt
							).toLocaleDateString()}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default GuideList;
