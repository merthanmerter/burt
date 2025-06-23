import Database from "bun:sqlite";
import { expect, test } from "bun:test";
import { appRouter } from "@/server/trpc";

function createTestContext(db: Database) {
	return {
		req: new Request("http://localhost:3000/trpc"),
		db,
	};
}

function createTestDb() {
	const db = new Database(":memory:");
	db.exec(
		"CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)",
	);
	db.exec("INSERT INTO users (name) VALUES (?)", ["John Doe"]);
	return db;
}

export const trpcRequest = () => {
	return appRouter.createCaller(createTestContext(createTestDb()));
};

test("should return hello message", async () => {
	const response = await trpcRequest().hello({ name: "World!" });
	expect(response.message).toBe("Hello, World!");
});

test("should return list of users", async () => {
	const response = await trpcRequest().users.list();
	expect(response).toEqual([
		{
			id: 1,
			name: "John Doe",
		},
	]);
});

test("should return readme", async () => {
	const response = await trpcRequest().readme();
	expect(response).toBeTypeOf("string");
	expect(response.length).toBeGreaterThan(1500);
});

test("should return user by id", async () => {
	const response = await trpcRequest().users.find({ id: 1 });
	expect(response).toEqual({ id: 1, name: "John Doe" });
});

test("should throw error when user not found", async () => {
	expect(trpcRequest().users.find({ id: 999 })).rejects.toThrow();
});

test("should throw error when input is invalid", async () => {
	expect(
		trpcRequest().hello({ name: 123 as unknown as string }),
	).rejects.toThrow();
});
