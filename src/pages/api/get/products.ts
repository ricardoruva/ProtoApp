import { NextApiRequest, NextApiResponse } from 'next';

import db from 'api/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
	} else {
		const { category } = req.body;

		const query: string = 'SELECT * FROM products WHERE category = ?';

		db.query(query, [category], (err, result) => {
			if (err) throw err;

			if (result.length <= 0) {
				res.status(500).json({ error: 'products not found' });
			} else {
				res.status(200).json({ products: result });
			}
		});
	}
}
