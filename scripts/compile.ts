import tailwind from "bun-plugin-tailwind";

process.env.NODE_ENV = "production";

const outputs: Bun.CompileBuildOptions[] = [
	{
		target: "bun-darwin-x64",
		outfile: "./bin/macos/index",
	},
	{
		target: "bun-darwin-arm64",
		outfile: "./bin/macos/index-arm64",
	},
	{
		target: "bun-linux-x64",
		outfile: "./bin/linux/index",
	},
	{
		target: "bun-windows-x64",
		outfile: "./bin/windows/index",
	},
];

async function compile(output: Bun.CompileBuildOptions) {
	console.log(`\n> compile ${output.target}`);

	try {
		await Bun.build({
			entrypoints: ["./src/index.tsx"],
			minify: true,
			define: {
				"process.env.NODE_ENV": '"production"',
			},
			plugins: [tailwind],
			compile: {
				target: output.target,
				outfile: output.outfile,
			},
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}

	console.log(`  ${output.outfile}`);
}

await Bun.$`tsr generate`;
await Bun.$`biome check . --write`;
await Bun.$`biome format --write .`;
await Bun.$`bun test`;

for (const output of outputs) {
	await compile(output);
}
