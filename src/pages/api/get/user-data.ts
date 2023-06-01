import { NextApiRequest, NextApiResponse } from 'next';

import db from 'api/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
	} else {
		const { sessionAuth }: { sessionAuth: string } = req.body;
		const query: string = 'SELECT * FROM users WHERE session_auth = ?';

		db.query(query, [sessionAuth], (err, result) => {
			if (err) throw err;

			if (result.length <= 0) {
				res.status(500).json({ error: 'user not found' });
			} else {
				res.status(200).json({ user: result[0] });
			}
		});
	}
}
