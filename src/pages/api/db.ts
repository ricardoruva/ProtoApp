import mysql from 'mysql';
import { connectionDatabase } from 'root/local.config';

const { DBPASSWORD, DBPORT } = connectionDatabase();

const db = mysql.createConnection({
	user: 'root',
	host: 'localhost',
	password: DBPASSWORD,
	database: 'proyecto_de_residencias',
	port: DBPORT,
});

export default db;
