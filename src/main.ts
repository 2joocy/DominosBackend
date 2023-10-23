import pg from 'pg';
import { environment } from './environment';
import { PgOrdersRepository } from './repositories/orders';
import express from 'express';
import cors from 'cors';
import { PgUsersRepository } from './repositories/users';
import { OrdersController } from './controllers/orders';
import { UserController } from './controllers/users';

const app = express();

app.use(express.json());
app.use(cors());

const { Pool } = pg;
const connection = new Pool({
	connectionString: environment.databaseUrl,
});

const ordersRepository = new PgOrdersRepository(connection);
const usersRepository = new PgUsersRepository(connection);

ordersRepository.init();
usersRepository.init();

app.use('/orders', OrdersController({ ordersRepository }));
app.use('/users', UserController({ usersRepository }));

export default app;
