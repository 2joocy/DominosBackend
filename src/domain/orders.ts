import z from 'zod';

export const Toppings = z.enum([
	'Pepperoni',
	'Mushrooms',
	'Onions',
	'Green Peppers',
	'Sausage',
	'Bacon',
	'Olives',
	'Tomatoes',
	'Extra Cheese',
	'Pineapple',
	'Spinach',
	'Ham',
	'Chicken',
	'Beef',
	'Salami',
	'Anchovies',
	'Artichokes',
	'Feta',
	'Goat Cheese',
	'Cheddar',
	'Parmesan',
	'Provolone',
	'Ricotta',
	'Gorgonzola',
	'Mozzarella',
	'Basil',
	'Garlic',
	'Jalapenos',
	'Oregano',
	'Parsley',
	'Pepper',
	'Red Pepper',
	'Chili Pepper',
	'Pesto',
	'Barbecue Sauce',
	'Buffalo Sauce',
	'Hot Sauce',
	'Ranch',
	'Salsa',
	'Sour Cream',
	'Alfredo Sauce',
	'Balsamic Vinegar',
	'Honey',
	'Mayonnaise',
	'Mustard',
	'Peanut Butter',
	'Soy Sauce',
	'Teriyaki Sauce',
	'Tomato Sauce',
]);

export const PizzaSchema = z.object({
	name: z.string(),
	size: z.enum(['Small', 'Medium', 'Large']),
	toppings: z.array(Toppings),
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
