import { useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { trpc } from "./lib/trpc";

export function APITester() {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<Awaited<
    ReturnType<typeof trpc.users.find.query>
  > | null>(null);

  const [users, setUsers] = useState<
    Awaited<ReturnType<typeof trpc.users.list.query>>
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
    const fetchData = async () => {
      try {
        const [userRes, usersRes] = await Promise.all([
          trpc.users.find.query({ id: 1 }),
          trpc.users.list.query(),
        ]);
        setUser(userRes);
        setUsers(usersRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      socket.close();
    };
  }, []);

  const socket = new WebSocket("ws://localhost:3000/ws");
  socket.addEventListener("message", (event) => {
    webSocketResponseInputRef.current!.value = event.data;
  });

  if (isLoading) {
    return (
      <div className='skeleton-container'>
        <div className='skeleton' />
        <div className='skeleton' />
        <div className='skeleton' />
        <div className='skeleton' />
        <div className='skeleton' />
      </div>
    );
  }

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
      <code className='users-list'>{JSON.stringify(user, null, 2)}</code>
      <code className='users-list'>{JSON.stringify(users, null, 2)}</code>
    </div>
  );
}
