import { useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { trpc } from "./lib/trpc";

export function APITester() {
  const [users, setUsers] = useState<
    Awaited<ReturnType<typeof trpc.getUsers.query>>
  >([]);
  const apiResponseInputRef = useRef<HTMLInputElement>(null);
  const webSocketResponseInputRef = useRef<HTMLInputElement>(null);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = z.string().parse(new FormData(e.currentTarget).get("name"));
    socket.send(name);
    const res = await trpc.hello.query({ name });
    apiResponseInputRef.current!.value = res.message;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await trpc.getUsers.query();
      setUsers(res);
    };

    fetchUsers();
  }, []);

  const socket = new WebSocket("ws://localhost:3000/ws");
  socket.addEventListener("message", (event) => {
    webSocketResponseInputRef.current!.value = event.data;
  });

  return (
    <div className='api-tester'>
      <form
        onSubmit={testEndpoint}
        className='endpoint-row'>
        <input
          type='text'
          name='name'
          defaultValue='World!'
          className='url-input'
          placeholder='World!'
        />
        <button
          type='submit'
          className='send-button'>
          Send
        </button>
      </form>
      <input
        ref={apiResponseInputRef}
        readOnly
        placeholder='API response will appear here...'
        className='response-area'
      />
      <input
        ref={webSocketResponseInputRef}
        readOnly
        placeholder='WebSocket response will appear here...'
        className='response-area'
      />
      <code className='users-list'>{JSON.stringify(users, null, 2)}</code>
    </div>
  );
}
