import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-background border-t">
			<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<nav
					className="-mx-5 -my-2 flex flex-wrap justify-center"
					aria-label="Footer"
				>
					<div className="px-5 py-2">
						<Link
							href="/legal"
							className="text-base text-gray-500 hover:text-gray-900"
						>
							Legal
						</Link>
					</div>
					<div className="px-5 py-2">
						<Link
							href="/source-code"
							className="text-base text-gray-500 hover:text-gray-900"
						>
							Source Code
						</Link>
					</div>
					<div className="px-5 py-2">
						<Link
							href="/contact"
							className="text-base text-gray-500 hover:text-gray-900"
						>
							Contact
						</Link>
					</div>
				</nav>
				<p className="mt-8 text-center text-base text-gray-400">
					© 2024 TikTok and Mental Health Study. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
