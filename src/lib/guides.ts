// src/lib/guides.ts

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrismPlus from "rehype-prism-plus";

export interface GuideMeta {
	title: string;
	description: string;
	author: string;
	createdAt: string;
	updatedAt: string;
}

export interface Guide {
	name: string; // Filename without extension
	meta: GuideMeta;
	content: string; // HTML content
}

const guidesDirectory = path.join(process.cwd(), "content", "guides");

// Simple in-memory cache
const guideCache: { [key: string]: Guide } = {};

// Fetch all guide filenames
export function getAllGuideNames(): string[] {
	const fileNames = fs.readdirSync(guidesDirectory);
	return fileNames
		.filter((file) => file.endsWith(".md"))
		.map((file) => file.replace(/\.md$/, ""));
}

// Fetch and parse a single guide by name with caching
export async function getGuideByName(name: string): Promise<Guide | null> {
	if (guideCache[name]) {
		return guideCache[name];
	}

	const fullPath = path.join(guidesDirectory, `${name}.md`);
	if (!fs.existsSync(fullPath)) {
		return null;
	}

	const fileContents = fs.readFileSync(fullPath, "utf8");
	const matterResult = matter(fileContents);

	const processedContent = await remark()
		.use(html, { sanitize: false })
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, {
			behavior: "append",
			content: {
				type: "text",
				value: " 🔗",
			},
		})
		.use(rehypePrismPlus)
		.process(matterResult.content);
	const contentHtml = processedContent.toString();

	const guideMeta: GuideMeta = {
		title: matterResult.data.title || "Untitled Guide",
		description: matterResult.data.description || "",
		author: matterResult.data.author || "Unknown",
		createdAt: matterResult.data.createdAt || "",
		updatedAt: matterResult.data.updatedAt || "",
	};

	const guide: Guide = {
		name,
		meta: guideMeta,
		content: contentHtml,
	};

	guideCache[name] = guide;

	return guide;
}
