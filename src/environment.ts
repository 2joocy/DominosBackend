const { DATABASE_URL, JWT_SECRET, PORT } = process.env;

export const environment = {
	databaseUrl: DATABASE_URL || 'postgres://postgres:password@localhost:5432/postgres',
	jwtSecret: JWT_SECRET || 'secret',
	port: PORT || 3000,
};
