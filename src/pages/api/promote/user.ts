import { NextApiRequest, NextApiResponse } from 'next';

import db from 'api/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
	} else {
		const { id } = req.body;

		const query: string = "UPDATE users SET admin = '1' WHERE id = ?";

		db.query(query, [id], (err, result) => {
			if (err) throw err;
			res.status(200).json({ promoted: true });
		});

		res.status(200).json({ completed: true });
	}
}
