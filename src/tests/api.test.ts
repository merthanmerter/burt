import { expect, test } from "bun:test";
import { db, users } from "@/server/db";
import { appRouter } from "@/server/trpc";

function createTestContext() {
	return {
		req: new Request("http://localhost:3000/trpc"),
		db,
	};
}

export const trpcRequest = () => {
	return appRouter.createCaller(createTestContext());
};

test("should return hello message", async () => {
	const response = await trpcRequest().hello({ name: "World!" });
	expect(response.message).toBe("Hello, World!");
});

test("should return list of users", async () => {
	const response = await trpcRequest().users.list();
	expect(response).toEqual([...users]);
});

test("should return readme", async () => {
	const response = await trpcRequest().readme();
	expect(response).toBeTypeOf("string");
	expect(response.length).toBeGreaterThan(1500);
});

test("should return user by id", async () => {
	const response = await trpcRequest().users.find({ id: 1 });
	expect(response).toEqual(users[0]);
});

test("should throw error when user not found", async () => {
	expect(trpcRequest().users.find({ id: 999 })).rejects.toThrow();
});

test("should throw error when input is invalid", async () => {
	expect(
		trpcRequest().hello({ name: 123 as unknown as string }),
	).rejects.toThrow();
});
