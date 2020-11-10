let Pool = require('pg').Pool

let pool = module.exports = new Pool({
    user: process.env.PGUSER || 'postgres',
    database: process.env.PGDATABASE || 'train_db',
    password: process.env.PASSWORD || ''
})

pool.on('error', (err, client) => {
    console.error('Unexpected error', err)
    throw Error("oops! db error.")
})

// initialize our tables
;( async()=>{

	let createListTableQuery = await pool.query(`
		CREATE TABLE IF NOT EXISTS train_lists(
			id SERIAL PRIMARY KEY
		)
	`)
	let createRunTableQuery = await pool.query(`
		CREATE TABLE IF NOT EXISTS train_runs(
			id SERIAL PRIMARY KEY,
			train_list_id int,
			train_line varchar,
			route_name varchar,
			run_number varchar,
			operator_id varchar,
			CONSTRAINT fk_train_list_id FOREIGN KEY (train_list_id) REFERENCES train_lists (id)
		)
	`)
})()
