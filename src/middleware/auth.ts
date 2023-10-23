import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../environment';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;

	if (!authorization) {
		res.status(401).json({ message: 'No authorization header' });
		return;
	}

	const token = authorization.replace('Bearer ', '');

	try {
		const { userId } = jwt.verify(token, environment.jwtSecret!) as {
			userId: string;
		};

		req.body.decoded = { userId };

		next();
	} catch (err) {
		res.status(401).json({ message: 'Invalid token' });
	}
};

export const sign = (userId: string) => jwt.sign({ userId }, environment.jwtSecret!, { expiresIn: '1h', algorithm: 'HS256' });
