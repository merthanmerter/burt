import { useQuery } from "@tanstack/react-query";
import { EyeIcon, StarIcon } from "lucide-react";
import { Button } from "./ui/button";

export const GitHubStars = () => {
	const { data: stars } = useQuery<{
		stargazers_count: number;
		watchers_count: number;
	}>({
		queryKey: ["github-stars"],
		queryFn: () =>
			fetch("https://api.github.com/repos/merthanmerter/burt")
				.then((res) => res.json())
				.catch(() => null),
	});

	return (
		<Button
			size="sm"
			variant="outline"
			render={
				<a
					target="_blank"
					href="https://github.com/merthanmerter/burt"
					rel="noopener"
				>
					<StarIcon className="size-4 fill-yellow-500 stroke-yellow-500" />
					<span>{stars?.stargazers_count}</span>
					<EyeIcon className="size-4 stroke-muted-foreground" />
					<span>{stars?.watchers_count}</span>
				</a>
			}
		/>
	);
};
