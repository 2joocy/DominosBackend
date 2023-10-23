import z from 'zod';

export const Toppings = z.object({
	name: z.string(),
	price: z.number(),
});

export const PizzaSchema = z.object({
	name: z.string(),
	size: z.enum(['Small', 'Medium', 'Large']),
	toppings: z.array(Toppings),
});

export type Order = {
	id: string;
	userId: string;
	pizzas: z.infer<typeof PizzaSchema>[];
	price: number;
};

export type Pizza = z.infer<typeof PizzaSchema>;

export interface OrdersRepository {
	find(id: string): Promise<Order>;
	getOrders(userId: string): Promise<Order[]>;
	save(order: Order): Promise<void>;
	delete(id: string): Promise<void>;
}
