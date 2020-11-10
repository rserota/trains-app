let express = require('express')
let multer = require('multer') // for MULTipart forms, ie file uploads
let papa = require('papaparse')
let pool = require('./db')

let app = express()
let upload = multer()

app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// get the list of train lists
app.get('/train-list', async (req, res)=>{
	let trainLists = await pool.query(`
		SELECT * FROM train_lists
	`)

	res.send({data:trainLists.rows})
})

// get the runs in a specific train list
app.get('/train-list/:id', async (req, res)=>{
	let trainRuns = await pool.query(`
		SELECT * FROM train_runs
		WHERE train_list_id = $1
	`, [req.params.id]
	)

	res.send({data:trainRuns.rows})
})

// create a train list
app.post('/train-list', upload.single('train-list'), async (req, res)=>{
	let csvObj = papa.parse(req.file.buffer.toString())
	csvObj.data.shift() // remove the headers from the CSV data

	let trainListInsertion = await pool.query(`INSERT INTO train_lists DEFAULT VALUES RETURNING id`)
	let trainListId = trainListInsertion.rows[0].id

	for ( let run of csvObj.data ) {
		let trainRunInsertion = await pool.query(`
			INSERT INTO train_runs ( train_list_id, train_line, route_name, run_number, operator_id )
			VALUES                 ( $1,            $2,         $3,         $4,         $5          )
		`, [trainListId, run[0].trim(), run[1].trim(), run[2].trim(), run[3].trim()]
		)
	}

	res.send({success:true, trainListId})
})

app.post('/runs', async (req, res)=>{
	let trainRunInsertion = await pool.query(`
			INSERT INTO train_runs ( train_list_id, train_line, route_name, run_number, operator_id )
			VALUES                 ( $1,            $2,         $3,         $4,         $5          )
		`, [req.body.train_list_id, req.body.train_line, req.body.route_name, req.body.run_number, req.body.operator_id]
	)
	res.send({success:true})
})

app.delete('/runs/:runId', async (req, res)=>{
	let deleteQuery = await pool.query(`
		DELETE FROM train_runs WHERE id = $1
	`, [req.params.runId]
	)
	res.send({success:true})
})

app.listen(80)
