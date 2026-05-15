import tailwind from "bun-plugin-tailwind";

await Bun.$`rm -rf public`;
await Bun.$`tsr generate`;
await Bun.$`biome check . --write`;
await Bun.$`biome format --write .`;
await Bun.$`bun test`;

const build = await Bun.build({
	entrypoints: ["./src/index.html"],
	minify: true,
	sourcemap: "linked",
	define: {
		"process.env.NODE_ENV": '"production"',
	},
	plugins: [tailwind],
	outdir: "./public",
});

if (!build.success) {
	for (const log of build.logs) {
		console.error(log);
	}

	process.exit(1);
}
