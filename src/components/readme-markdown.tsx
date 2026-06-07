import burtLogoWhite from "@/components/logo/burt-logo-white.png";
import { useTRPC } from "@/lib/trpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { marked } from "marked";

export default function ReadmeMarkdown() {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.readme.queryOptions());

	// GitHub renders the README's <picture> (OS-based); in-app, swap it for the
	// white logo and let the theme toggle invert it to black in light mode.
	const __html = marked(
		data.replace(
			/<picture>[\s\S]*?<\/picture>/,
			`<img src="${burtLogoWhite}" alt="Burt" width="200" class="invert dark:invert-0" />`,
		),
	);

	return (
		<div
			className="markdown"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted content from our own README.md
			dangerouslySetInnerHTML={{ __html }}
		/>
	);
}
