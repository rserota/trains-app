let express = require('express')
let multer = require('multer') // for MULTipart forms, ie file uploads
let papa = require('papaparse')
let db = require('./db')

let app = express()
let upload = multer()

app.use(express.static('./public'))
app.use(express.json())


app.post('/train-list', upload.single('train-list'), (req, res)=>{
	console.log('new train list!')
	console.log(req.file.buffer.toString())
	let csvObj = papa.parse(req.file.buffer.toString())
	console.log(csvObj)
	res.send({got:'em'})
	//res.send(csvObj)
})

app.listen(80)
