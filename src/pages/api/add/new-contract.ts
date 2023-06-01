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
			const { contractName, contractDescription, contractCashback, contractAdded, contractService } = fields;

			const contractImageFile = files.contractImage as formidable.File;
			const contractImage = await saveFile(contractImageFile, 'contracts-pictures');

			const query: string = 'INSERT INTO contracts (name, description, image, service, cashback, date_added) VALUES (?,?,?,?,?,?)';
			const values = [
				contractName,
				contractDescription,
				contractImage,
				contractService,
				contractCashback,
				contractAdded,
			];

			db.query(query, values, (err, result) => {
				if (err) throw err;
				res.status(200).json({ saved: true });
			});
		});
	}
}
