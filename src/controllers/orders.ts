import { randomUUID } from 'crypto';
import { Pizza, PizzaSchema } from '../domain/orders';
import { auth } from '../middleware/auth';
import { PgOrdersRepository } from '../repositories/orders';
import express from 'express';

export function OrdersController({ ordersRepository }: { ordersRepository: PgOrdersRepository }) {
	const router = express.Router();

	router.get('/', auth, async (req, res) => {
		try {
			const orders = await ordersRepository.getOrders(req.body.decoded.userId);
			res.json(orders);
		} catch (error) {
			if (error instanceof Error) res.status(500).json({ message: error.message });
		}
	});

	router.post('/', auth, async (req, res) => {
		try {
			const { pizzas } = req.body as { pizzas: Pizza[] };
			const parsedPizzas = pizzas.map((pizza) => PizzaSchema.parse(pizza));
			const price = pizzas.reduce((accPizza, pizza) => {
				const pricePerSize = {
					Small: 10,
					Medium: 15,
					Large: 20,
				};
				const pricePerPizza = pizza.toppings.reduce((accTopping, topping) => accTopping + topping.price, 0) + pricePerSize[pizza.size];
				return accPizza + pricePerPizza;
			}, 0);
			const order = {
				id: randomUUID(),
				userId: req.body.decoded.userId,
				pizzas: parsedPizzas,
				price,
			};

			await ordersRepository.save(order);

			res.json(order);
		} catch (error) {
			if (error instanceof Error) res.status(500).json({ message: error.message });
		}
	});

	return router;
}
