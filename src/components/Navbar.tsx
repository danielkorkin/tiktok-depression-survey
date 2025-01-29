"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";

export default function Navbar() {
	const { theme, setTheme } = useTheme();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="bg-white dark:bg-gray-900 border-b sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link
							href="/"
							className="flex-shrink-0 flex items-center text-xl font-bold text-primary"
						>
							TikTok Study
						</Link>
					</div>
					<div className="hidden md:flex items-center space-x-4">
						<Link
							href="/participate"
							className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
						>
							Participate
						</Link>
						<Link
							href="/login"
							className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
						>
							Login
						</Link>
						<Link
							href="/guides"
							className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
						>
							Guides
						</Link>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Toggle theme"
							onClick={() =>
								setTheme(theme === "dark" ? "light" : "dark")
							}
						>
							<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
							<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
							<span className="sr-only">Toggle theme</span>
						</Button>
						<Button asChild>
							<Link href="/participate">Participate</Link>
						</Button>
					</div>
					<div className="md:hidden flex items-center">
						<Button
							variant="ghost"
							size="icon"
							aria-label="Toggle menu"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</Button>
					</div>
				</div>
			</div>
			{isMenuOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						<Link
							href="/participate"
							className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
						>
							Participate
						</Link>
						<Link
							href="/login"
							className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
						>
							Login
						</Link>
						<Link
							href="/guides"
							className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
						>
							Guides
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}
