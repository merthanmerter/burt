import tailwind from "bun-plugin-tailwind";

type CompileTarget = {
	label: string;
	target: Bun.Build.Target;
	outfile: string;
};

const targets: CompileTarget[] = [
	{
		label: "macOS x64",
		target: "bun-darwin-x64",
		outfile: "./bin/macos/index",
	},
	{
		label: "macOS arm64",
		target: "bun-darwin-arm64",
		outfile: "./bin/macos/index-arm64",
	},
	{
		label: "Linux x64",
		target: "bun-linux-x64",
		outfile: "./bin/linux/index",
	},
	{
		label: "Windows x64",
		target: "bun-windows-x64",
		outfile: "./bin/windows/index",
	},
];

process.env.NODE_ENV = "production";

async function runStep(name: string, command: Promise<unknown>) {
	console.log(`\n> ${name}`);
	await command;
}

async function compile(target: CompileTarget) {
	console.log(`\n> compile ${target.label}`);

	try {
		await Bun.build({
			entrypoints: ["./src/index.tsx"],
			minify: true,
			define: {
				"process.env.NODE_ENV": '"production"',
			},
			plugins: [tailwind],
			compile: {
				target: target.target,
				outfile: target.outfile,
			},
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}

	console.log(`  ${target.outfile}`);
}

await runStep("generate routes", Bun.$`tsr generate`);
await runStep("lint", Bun.$`biome check . --write`);
await runStep("format", Bun.$`biome format --write .`);
await runStep("test", Bun.$`bun test`);

for (const target of targets) {
	await compile(target);
}
