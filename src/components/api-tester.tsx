import { useForm } from "@tanstack/react-form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { z } from "zod";
import { useTRPC } from "@/lib/trpc-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function APITester() {
	const apiResponseInputRef = useRef<HTMLInputElement>(null);
	// const webSocketResponseInputRef = useRef<HTMLInputElement>(null);
	// const socketRef = useRef<WebSocket | null>(null);
	const trpc = useTRPC();

	const { data: user } = useSuspenseQuery(
		trpc.users.find.queryOptions({ id: 1 }),
	);
	const { data: users } = useSuspenseQuery(trpc.users.list.queryOptions());

	const helloMutation = useMutation(
		trpc.hello.mutationOptions({
			onSuccess: async (res) => {
				// biome-ignore lint/style/noNonNullAssertion: !
				apiResponseInputRef.current!.value = res.message;
			},
			onError: (err) => {
				// biome-ignore lint/style/noNonNullAssertion: !
				apiResponseInputRef.current!.value = err.message;
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			name: "World!",
		},
		validators: {
			onChange: z.object({
				name: z.string().min(1, "Name is required"),
			}),
		},
		onSubmit: ({ value }) => {
			// api call
			helloMutation.mutate({ name: value.name });

			// websocket send
			// if (
			// 	socketRef.current &&
			// 	socketRef.current.readyState === WebSocket.OPEN
			// ) {
			// 	socketRef.current.send(value.name);
			// }
		},
	});

	// useEffect(() => {
	// 	socketRef.current = ws;

	// 	const messageHandler = (event: MessageEvent) => {
	// 		if (webSocketResponseInputRef.current) {
	// 			webSocketResponseInputRef.current.value = event.data;
	// 		}
	// 	};

	// 	socketRef.current?.addEventListener("message", messageHandler);

	// 	return () => {
	// 		socketRef.current?.removeEventListener("message", messageHandler);
	// 	};
	// }, []);

	return (
		<div className="space-y-4">
			<form
				className="flex gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.Field name="name">
					{(field) => (
						<div className="flex-1">
							<Input
								aria-invalid={!field.state.meta.isValid}
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							{/* {!field.state.meta.isValid && (
							<em className="text-destructive text-xs">
								{field.state.meta.errors[0]?.message}
							</em>
						)} */}
						</div>
					)}
				</form.Field>
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<Button type="submit" disabled={!canSubmit}>
							{isSubmitting ? "Submitting..." : "Submit"}
						</Button>
					)}
				</form.Subscribe>
			</form>
			<Input
				ref={apiResponseInputRef}
				readOnly
				placeholder="API response will appear here..."
			/>
			{/* <Input
				ref={webSocketResponseInputRef}
				readOnly
				placeholder="WebSocket response will appear here..."
			/> */}
			<Textarea value={JSON.stringify(user, null, 2)} readOnly rows={4} />
			<Textarea value={JSON.stringify(users, null, 2)} readOnly rows={10} />
		</div>
	);
}
