import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import path from 'path';
import db from 'api/db';
import formidable from 'formidable';

export const config = {
	api: {
		bodyParser: false,
	},
};

export const saveFile = (file: formidable.File, folder: string) => {
	const extension = path.extname(file.originalFilename ? file.originalFilename.toString() : '');
	const filename = `${Date.now()}${extension}`;
	const filepath = path.join(process.cwd(), '/public/img', folder, filename);
	const filepathdb = `/img/${folder}/${filename}`;
	const buffer = fs.readFileSync(file.filepath);
	const writeStream = fs.createWriteStream(filepath);

	writeStream.write(buffer);
	writeStream.end();

	return new Promise((resolve, reject) => {
		writeStream.on('finish', () => {
			resolve(filepathdb);
		});
		writeStream.on('error', (error) => {
			reject(error);
		});
	});
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'method not allowed' });
	} else {
		const form = new formidable.IncomingForm();

		form.parse(req, async (err, fields, files) => {
			if (err) throw err;
			const { name, dateAdded, description, cashback, price, category, type } = fields;

			const productImage = files.image as formidable.File;
			const image = await saveFile(productImage, 'products-pictures');

			const query: string =
				'INSERT INTO products (product, date_added, image, description, cashback, price, category, type) VALUE (?,?,?,?,?,?,?,?)';
			const values = [name, dateAdded, image, description, cashback, price, category, type];

			db.query(query, values, (err, result) => {
				if (err) throw err;
				res.status(200).json({ saved: true });
			});
		});
	}
}
