let express = require('express')
let multer = require('multer') // for MULTipart forms, ie file uploads
let papa = require('papaparse')
let pool = require('./db')

let app = express()
let upload = multer()

app.use(express.static('./public'))
app.use(express.json())


app.post('/train-list', upload.single('train-list'), async (req, res)=>{
	console.log('new train list!')
	console.log(req.file.buffer.toString())
	let csvObj = papa.parse(req.file.buffer.toString())
	console.log(csvObj)

	let trainListInsertion = await pool.query(`INSERT INTO train_lists DEFAULT VALUES RETURNING id`)
	let trainListId = trainListInsertion.rows[0].id

	let trainRunInsertion = await pool.query(`
		INSERT INTO train_runs ( train_list_id )
		VALUES                 ( $1 )
	`, [trainListId])

	res.send({got:'em'})
})

app.listen(80)
