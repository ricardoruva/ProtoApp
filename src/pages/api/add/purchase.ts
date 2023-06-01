import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import db from 'api/db';

export const config = {
	api: {
		bodyParser: false,
	},
};

function queryPromise<T>(query: string, values: any[]): Promise<T> {
	return new Promise((resolve, reject) => {
		db.query(query, values, (error, result: T) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
		return;
	}

	const form = new formidable.IncomingForm();
	form.parse(req, async (err, fields, files) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		const { sessionAuth, saveCard, products, productsPrices, productsQuantity, date, dateAdded, cashback } = fields;

		let name = '';
		let email = '';

		const getUserEmail = 'SELECT * FROM users WHERE session_auth = ?';
		const result = await queryPromise<{ username: string; email: string }[]>(getUserEmail, [sessionAuth]);

		if (result.length <= 0) {
			res.status(404).json({ error: 'User not found' });
			return;
		}

		name = result[0].username;
		email = result[0].email;

		if (saveCard === 'true') {
			const {
				type,
				holder,
				number,
				expirationDate,
				securityCode,
				fullName,
				country,
				locality,
				firstDirection,
				secondDirection,
				postalCode,
				phoneNumber,
			} = fields;

			const saveCardQuery = `INSERT INTO cards (
        email,
        type,
        holder,
        number,
        expiration_date,
        security_code,
        fullname,
        country,
        locality,
        first_direction,
        second_direction,
        postal_code,
        number_phone
      ) VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

			const saveCardValues = [
				email,
				type,
				holder,
				number,
				expirationDate,
				securityCode,
				fullName,
				country,
				locality,
				firstDirection,
				secondDirection !== 'none' ? secondDirection : null,
				postalCode,
				phoneNumber,
			];

			try {
				await queryPromise(saveCardQuery, saveCardValues);
			} catch (error) {
				res.status(500).json({ error: 'Error while saving card' });
				return;
			}
		}

		const savePurchaseQuery = `INSERT INTO purchase_history (
      username,
      products,
      products_prices,
      products_quantity,
      date,
      date_added
    ) VALUE (?,?,?,?,?,?)`;

		const savePurchaseValues = [name, products, productsPrices, productsQuantity, date, dateAdded];

		try {
			await queryPromise(savePurchaseQuery, savePurchaseValues);
			await queryPromise('DELETE FROM cart WHERE email = ?', [email]);
			await queryPromise('UPDATE users SET total_cashback = ? WHERE email = ?', [cashback, email]);
			res.status(200).json({ message: 'Purchase successful' });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Error while saving purchase history' });
			return;
		}
	});
}
