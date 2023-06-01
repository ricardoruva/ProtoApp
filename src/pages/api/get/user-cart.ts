import { NextApiRequest, NextApiResponse } from 'next';

import db from 'api/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
	} else {
		const { sessionAuth }: { sessionAuth: string } = req.body;
		const selectMail: string = 'SELECT * FROM users WHERE session_auth = ?';
		const getCart: string = 'SELECT * FROM cart WHERE email = ?';

		db.query(selectMail, [sessionAuth], (err, result) => {
			if (err) throw err;

			if (result.length <= 0) {
				res.status(500).json({ error: 'user not found' });
			} else {
				const email = result[0].email;

				db.query(getCart, [email], (err, result) => {
					if (err) throw err;

					if (result.length <= 0) {
						res.status(200).json({ error: 'this user does not have cart' });
					} else {
						res.status(200).json({ cart: result });
					}
				});
			}
		});
	}
}
