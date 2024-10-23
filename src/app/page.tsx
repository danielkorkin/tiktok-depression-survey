import Link from "next/link";

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-4xl font-bold mb-4">Welcome to Our Study</h1>
			<Link href="/participate" legacyBehavior>
				<a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
					Participate
				</a>
			</Link>
		</main>
	);
}
