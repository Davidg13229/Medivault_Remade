// const mysql = require('mysql2');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
	host:'localhost',
	user:'root',
	password:'admin',
	database:'infoman'
});

pool.getConnection()
	.then(connection => {
		console.log('Connected to the database');
		connection.release();
	})
	.catch(err => {
		console.error('Error connecting to the database:', err);
	});

module.exports = pool;
