import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import db from 'api/db';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
	} else {
		const { id, image } = req.body;

		const query: string = 'DELETE FROM contracts WHERE id = ?';

		const imagePath = path.join(process.cwd(), '/public', image);
		fs.unlink(imagePath, (err) => {
			if (err) throw err;
		});

		db.query(query, [id], (err, result) => {
			if (err) throw err;
			res.status(200).json({ deleted: true });
		});
	}
}
