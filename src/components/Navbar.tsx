"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
	const { theme, setTheme } = useTheme();

	return (
		<nav className="bg-background border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<Link
							href="/"
							className="flex-shrink-0 flex items-center"
						>
							TikTok Study
						</Link>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							<Link
								href="/guides"
								className="inline-flex items-center px-1 pt-1 text-sm font-medium"
							>
								Guides
							</Link>
						</div>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							<Link
								href="/participate"
								className="inline-flex items-center px-1 pt-1 text-sm font-medium"
							>
								Participate
							</Link>
						</div>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							<Link
								href="/login"
								className="inline-flex items-center px-1 pt-1 text-sm font-medium"
							>
								Login
							</Link>
						</div>
					</div>
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="icon"
							aria-label="Toggle theme"
							className="mr-6"
							onClick={() =>
								setTheme(theme === "dark" ? "light" : "dark")
							}
						>
							<Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
							<Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
							<span className="sr-only">Toggle theme</span>
						</Button>
						<Button asChild>
							<Link href="/participate">Participate</Link>
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
}
