import { NextApiRequest, NextApiResponse } from 'next';
import db from 'api/db';

type ErrorResponse = { error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<ErrorResponse | { purchases: any[] }>) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
		return;
	}

	const { sessionAuth } = req.body;
	const selectUsername = 'SELECT * FROM users WHERE session_auth = ?';
	const getCart = 'SELECT * FROM purchase_history WHERE username = ?';

	db.query(selectUsername, [sessionAuth], (err, result) => {
		if (err) throw err;

		if (result.length <= 0) {
			res.status(404).json({ error: 'User not found' });
			return;
		}

		const username = result[0].username;

		db.query(getCart, [username], (err, result) => {
			if (err) throw err;

			if (result.length <= 0) {
				res.status(400).json({ error: 'This user does not have any purchases' });
				return;
			}

			res.status(200).json({ purchases: result });
		});
	});
}
