import tailwind from "bun-plugin-tailwind";

await Bun.$`rm -rf public`;

const result = await Bun.build({
	entrypoints: ["./src/index.html"],
	outdir: "./public",
	target: "browser",
	sourcemap: "linked",
	minify: true,
	env: "BUN_PUBLIC_*",
	define: {
		"process.env.NODE_ENV": '"production"',
	},
	plugins: [tailwind],
});

if (!result.success) {
	for (const log of result.logs) {
		console.error(log);
	}

	process.exit(1);
}
