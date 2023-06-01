import { compare } from 'bcrypt';
import { setCookie } from 'nookies';
import { NextApiRequest, NextApiResponse } from 'next';

import connection from 'api/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const { email, password } = req.body;

		const query = 'SELECT * FROM users WHERE email = ?';

		connection.query(query, [email, password], async (err, result) => {
			if (err) throw err;
			if (result.length > 0) {
				if (!(await compare(password, result[0].password))) {
					res.status(401).json({ auth: false });
				} else {
					const sessionId = Math.random().toString(36).substring(2);

					setCookie({ res }, 'session-id', sessionId, {
						maxAge: 30 * 24 * 60 * 60,
						path: '/',
						httpOnly: true,
						sameSite: 'strict',
					});

					const encodedSessionAuth = result[0].session_auth;

					setCookie({ res }, 'session-auth', encodedSessionAuth, {
						maxAge: 30 * 24 * 60 * 60,
						path: '/',
						httpOnly: true,
						sameSite: 'strict',
					});

					res.status(200).json({ auth: true });
				}
			} else {
				res.status(401).json({ auth: false });
			}
		});
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
