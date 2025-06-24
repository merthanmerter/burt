let ws: WebSocket;

function createWebSocket() {
	const protocol = location.protocol === "https:" ? "wss:" : "ws:";
	const host = location.host;
	return new WebSocket(`${protocol}//${host}/ws`);
}

if (import.meta.hot) {
	ws = import.meta.hot.data.ws ??= createWebSocket();

	// Don't close the socket on HMR - keep it alive
	import.meta.hot.dispose(() => {
		// Save the socket for the next module
		import.meta.hot.data.ws = ws;
	});

	import.meta.hot.accept();
} else {
	ws = createWebSocket();
}

export { ws };
