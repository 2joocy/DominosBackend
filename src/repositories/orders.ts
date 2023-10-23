import { Order, OrdersRepository } from '../domain/orders';
import { Pool } from 'pg';

export class PgOrdersRepository implements OrdersRepository {
	private readonly connectionPool: Pool;

	constructor(connectionPool: Pool) {
		this.connectionPool = connectionPool;
	}

	async find(id: string) {
		const client = await this.connectionPool.connect();
		try {
			const { rows } = await client.query(
				`
          SELECT * FROM orders WHERE id = $1
        `,
				[id],
			);
			client.release();

			return rows[0];
		} finally {
			client.release();
		}
	}

	async getOrders(userId: string) {
		const client = await this.connectionPool.connect();
		const { rows } = await client.query(
			`
                SELECT * FROM orders WHERE user_id = $1
            `,
			[userId],
		);

		client.release();

		return rows;
	}

	async save(order: Order) {
		const client = await this.connectionPool.connect();
		await client.query(
			`
                INSERT INTO orders (id, user_id, pizzas) VALUES ($1, $2, $3)
            `,
			[order.id, order.userId, order.pizzas],
		);
		client.release();
	}

	async delete(id: string) {
		const client = await this.connectionPool.connect();
		await client.query(
			`
                DELETE FROM orders WHERE id = $1
            `,
			[id],
		);
		client.release();
	}

	async init() {
		await this.connectionPool.query(
			`
                DROP TABLE IF EXISTS orders;
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    pizzas JSONB NOT NULL,
                    price NUMERIC NOT NULL,
                )
            `,
		);
	}
}
