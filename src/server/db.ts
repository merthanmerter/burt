// import sql from "bun:sqlite";
// const db = sql.open("./db.sqlite");

export const users = [
	{ id: 1, name: "John Doe" },
	{ id: 2, name: "Jane Doe" },
];

export const db = {
	query: () => ({
		all: () => users,
		get: (id: number) => users.find((user) => user.id === id),
	}),
};
