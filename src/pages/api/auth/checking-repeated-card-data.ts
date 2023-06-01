import { NextApiRequest, NextApiResponse } from 'next';

import connection from 'api/db';
import formidable from 'formidable';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const form = new formidable.IncomingForm();

		form.parse(req, (err, fields, files) => {
			if (err) throw err;
			const { number } = fields;

			const query: string = 'SELECT * FROM cards WHERE number = ?';

			connection.query(query, [number], (err, result) => {
				if (err) throw err;
				if (result.length > 0) {
					res.status(409).json({ verified: true });
				} else {
					res.status(200).json({ verified: false });
				}
			});
		});
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
