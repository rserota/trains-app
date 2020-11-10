let express = require('express')
let multer = require('multer') // for MULTipart forms, ie file uploads
let papa = require('papaparse')
let pool = require('./db')

let app = express()
let upload = multer()

app.use(express.static('./public'))
app.use(express.json())

app.get('/train-list', async (req, res)=>{
	let trainLists = await pool.query(`
		SELECT * FROM train_lists
	`)

	res.send({data:trainLists.rows})
})

app.get('/train-list/:id', async (req, res)=>{
	let trainRuns = await pool.query(`
		SELECT * FROM train_runs
		WHERE train_list_id = $1
	`, [req.params.id]
	)

	res.send({data:trainRuns.rows})
})

app.post('/train-list', upload.single('train-list'), async (req, res)=>{
	console.log('new train list!')
	console.log(req.file.buffer.toString())
	let csvObj = papa.parse(req.file.buffer.toString())
	console.log(csvObj)
	csvObj.data.shift() // remove the headers from the CSV data

	let trainListInsertion = await pool.query(`INSERT INTO train_lists DEFAULT VALUES RETURNING id`)
	let trainListId = trainListInsertion.rows[0].id

	for ( let run of csvObj.data ) {
		let trainRunInsertion = await pool.query(`
			INSERT INTO train_runs ( train_list_id, train_line, route_name, run_number, operator_id )
			VALUES                 ( $1,            $2,         $3,         $4,         $5          )
		`, [trainListId, run[0], run[1], run[2], run[3]]
		)
	}

	res.send({got:'em'})
})

app.listen(80)
