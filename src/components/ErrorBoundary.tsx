// src/components/ErrorBoundary.tsx

"use client";

import React from "react";

interface ErrorBoundaryState {
	hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	ErrorBoundaryState
> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_: Error): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<h1 className="text-center text-red-500">
					Something went wrong.
				</h1>
			);
		}

		return this.props.children;
	}
}
