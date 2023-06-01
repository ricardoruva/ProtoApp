import { NextApiRequest, NextApiResponse } from 'next';

import db from 'api/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
	} else {
		const { service } = req.body;

		const query: string = 'SELECT * FROM contracts WHERE service = ?';

		db.query(query, [service], (err, result) => {
			if (err) throw err;

			if (result.length <= 0) {
				res.status(500).json({ error: 'contracts not found' });
			} else {
				res.status(200).json({ contracts: result });
			}
		});
	}
}
