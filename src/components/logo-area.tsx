import biomeLogo from "@/components/logo/biome.svg";
import bunLogo from "@/components/logo/bun.svg";
import reactLogo from "@/components/logo/react.svg";
import shadcnLogo from "@/components/logo/shadcn.svg";
import tailwindLogo from "@/components/logo/tailwind.svg";
import tanstackLogo from "@/components/logo/tanstack.svg";
import trpcLogo from "@/components/logo/trpc.svg";
import zodLogo from "@/components/logo/zod.svg";

export default function LogoArea() {
	return (
		<div className="flex gap-2 sm:gap-4 justify-center items-center mb-8">
			<img
				src={bunLogo}
				alt="Bun Logo"
				className="size-8 sm:size-14 hover:scale-110 transition-transform duration-200"
			/>
			<img
				src={reactLogo}
				alt="React Logo"
				className="size-8 sm:size-12 hover:scale-110 transition-transform duration-200"
			/>
			<img
				src={trpcLogo}
				alt="TRPC Logo"
				className="size-8 sm:size-12 hover:scale-110 transition-transform duration-200"
			/>
			<img
				src={tanstackLogo}
				alt="TanStack Logo"
				className="size-8 sm:size-12 hover:scale-110 transition-transform duration-200"
			/>
			<img
				src={shadcnLogo}
				alt="Shadcn Logo"
				className="size-8 sm:size-12 hover:scale-110 transition-transform duration-200 dark:invert"
			/>
			<img
				src={tailwindLogo}
				alt="Tailwind Logo"
				className="size-8 sm:size-12 hover:scale-110 transition-transform duration-200"
			/>
			<img
				src={zodLogo}
				alt="Zod Logo"
				className="size-8 sm:size-12 hover:scale-110 transition-transform duration-200"
			/>
			<img
				src={biomeLogo}
				alt="Zod Logo"
				className="size-8 sm:size-12 hover:scale-110 transition-transform duration-200"
			/>
		</div>
	);
}
