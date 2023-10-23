import z from 'zod';

export const Topping = z.enum([
	'Pepperoni',
	'Mushrooms',
	'Onions',
	'Green Peppers',
	'Sausage',
	'Bacon',
	'Olives',
	'Tomatoes',
	'Extra Cheese',
]);

export const PizzaSchema = z.object({
	name: z.string(),
	size: z.enum(['Small', 'Medium', 'Large']),
	toppings: z.array(Topping),
	price: z.number(),
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
