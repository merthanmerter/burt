import { useTRPC } from "@/lib/trpc-client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, type FormEvent } from "react";
import { toast } from "sonner";
import { z, ZodError } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function APITester() {
  const apiResponseInputRef = useRef<HTMLInputElement>(null);
  const webSocketResponseInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const trpc = useTRPC();

  const { data: user } = useSuspenseQuery(
    trpc.users.find.queryOptions({ id: 1 }),
  );
  const { data: users } = useSuspenseQuery(trpc.users.list.queryOptions());

  const helloMutation = useMutation(
    trpc.hello.mutationOptions({
      onSuccess: async (res) => {
        apiResponseInputRef.current!.value = res.message;
      },
      onError: (err) => {
        apiResponseInputRef.current!.value = err.message;
      },
    }),
  );

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const socket = new WebSocket(`${protocol}//${host}/ws`);
    socketRef.current = socket;

    socket.addEventListener("message", (event) => {
      if (webSocketResponseInputRef.current) {
        webSocketResponseInputRef.current.value = event.data;
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // api call
      const name = await z
        .string()
        .min(1)
        .parseAsync(new FormData(e.currentTarget).get("name"));

      helloMutation.mutate({ name });

      // websocket send
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(name);
      }
    } catch (error) {
      toast.error(
        error instanceof ZodError
          ? error.errors.map((e) => e.message).join(", ")
          : error instanceof Error
          ? error.message
          : "Unknown error",
      );
    }
  };

  return (
    <div className='min-w-md max-w-xl mx-auto space-y-4 my-auto'>
      <form
        onSubmit={testEndpoint}
        className='flex gap-2'>
        <Input
          type='text'
          name='name'
          defaultValue='World!'
          placeholder='World!'
        />
        <Button type='submit'>Send</Button>
      </form>
      <Input
        ref={apiResponseInputRef}
        readOnly
        placeholder='API response will appear here...'
      />
      <Input
        ref={webSocketResponseInputRef}
        readOnly
        placeholder='WebSocket response will appear here...'
      />
      <Textarea>{JSON.stringify(user, null, 2)}</Textarea>
      <Textarea>{JSON.stringify(users, null, 2)}</Textarea>
    </div>
  );
}
