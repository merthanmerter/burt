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
  const socketRef = useRef<WebSocket | null>(null);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // api call
    const name = z.string().parse(new FormData(e.currentTarget).get("name"));
    const res = await trpc.hello.query({ name });
    apiResponseInputRef.current!.value = res.message;

    // websocket send
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(name);
    }
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
