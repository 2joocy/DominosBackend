import { Pool } from 'pg';
import { User, UsersRepository } from '../domain/users';
import bcrypt from 'bcrypt';

export class PgUsersRepository implements UsersRepository {
	private readonly connectionPool: Pool;

	constructor(connectionPool: Pool) {
		this.connectionPool = connectionPool;
	}

	async find(id: string) {
		const { rows } = await this.connectionPool.query(
			`
      SELECT * FROM users WHERE id = $1
    `,
			[id],
		);

		return rows[0];
	}

	async findByEmail(email: string) {
		const { rows } = await this.connectionPool.query(
			`
      SELECT * FROM users WHERE email = $1
    `,
			[email],
		);

		return rows[0];
	}

	async save(user: User) {
		if (user.password === undefined) throw new Error('Password is required');

		const hashedPassword = await bcrypt.hash(user.password, 8);

		await this.connectionPool.query(
			`
      INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)
    `,
			[user.id, user.name, user.email, hashedPassword],
		);
	}

	async login(email: string, password: string) {
		const user = await this.findByEmail(email);

		if (!user) throw new Error('User not found');

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) throw new Error('Invalid password');

		return user;
	}

	async init() {
		await this.connectionPool.query(
			`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    password TEXT NOT NULL
                )
            `,
		);
	}
}
