// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "TikTok and Mental Health Study",
	description:
		"A research study on the relationship between TikTok usage and mental health",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} bg-background text-foreground`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<ErrorBoundary>
						<div className="flex flex-col min-h-screen">
							<Navbar />
							<main className="flex-grow">{children}</main>
							<Footer />
						</div>
					</ErrorBoundary>
				</ThemeProvider>
			</body>
		</html>
	);
}
