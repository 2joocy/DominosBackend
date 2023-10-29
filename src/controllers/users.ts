import { PgUsersRepository } from '../repositories/users';
import { randomUUID } from 'crypto';
import express from 'express';
import { auth, sign } from '../middleware/auth';
import { UserSchema } from '../domain/users';

export function UserController({ usersRepository }: { usersRepository: PgUsersRepository }) {
	const router = express.Router();

	router.post('/login', async (req, res) => {
		try {
			const { email, password } = req.body as { email: string; password: string };
			const user = await usersRepository.login(email, password);
			const token = sign(user.id);
			res.json({ user, token });
		} catch (error) {
			if (error instanceof Error) res.status(500).json({ message: error.message });
		}
	});

	router.post('/signup', async (req, res) => {
		try {
			const { name, email, password } = req.body as { name: string; email: string; password: string };
			const parsed = UserSchema.parse({ name, email, password });
			const user = { ...parsed, id: randomUUID() };

			await usersRepository.save(user);

			res.json({ user, token: sign(user.id) });
		} catch (error) {
			if (error instanceof Error) res.status(500).json({ message: error.message });
		}
	});

	return router;
}
