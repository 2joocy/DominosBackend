import z from 'zod';

export const UserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(8),
});

export type User = z.infer<typeof UserSchema> & { id: string; password?: string };

export interface UsersRepository {
	find(id: string): Promise<User>;
	login(email: string, password: string): Promise<User>;
	findByEmail(email: string): Promise<User>;
	save(user: User): Promise<void>;
}
