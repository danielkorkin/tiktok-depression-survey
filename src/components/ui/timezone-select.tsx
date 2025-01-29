"use client";

import { useTheme } from "next-themes";
import ReactTimezoneSelect from "react-timezone-select";
import { cn } from "@/lib/utils";

interface TimezoneSelectProps {
	className?: string;
	value: string;
	onChange: (timezone: { value: string }) => void;
}

export default function TimezoneSelect({
	className,
	value,
	onChange,
}: TimezoneSelectProps) {
	const { theme } = useTheme();

	const isDark = theme === "dark";

	return (
		<ReactTimezoneSelect
			value={value}
			onChange={onChange}
			className={cn("react-timezone-select", className)}
			styles={{
				container: (base) => ({
					...base,
				}),
				control: (base) => ({
					...base,
					backgroundColor: isDark
						? "hsl(var(--background))"
						: base.backgroundColor,
					borderColor: "hsl(var(--input))",
					"&:hover": {
						borderColor: "hsl(var(--input))",
					},
				}),
				menu: (base) => ({
					...base,
					backgroundColor: isDark
						? "hsl(var(--popover))"
						: base.backgroundColor,
					borderColor: "hsl(var(--border))",
				}),
				option: (base, state) => ({
					...base,
					backgroundColor: isDark
						? state.isFocused
							? "hsl(var(--accent))"
							: "transparent"
						: state.isFocused
						? base.backgroundColor
						: "transparent",
					color: isDark ? "hsl(var(--foreground))" : base.color,
					"&:hover": {
						backgroundColor: isDark
							? "hsl(var(--accent))"
							: base["&:hover"]?.backgroundColor,
					},
				}),
				singleValue: (base) => ({
					...base,
					color: isDark ? "hsl(var(--foreground))" : base.color,
				}),
				input: (base) => ({
					...base,
					color: isDark ? "hsl(var(--foreground))" : base.color,
				}),
			}}
		/>
	);
}
