require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Phonebook = require('./models/phonebook')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(
	morgan(
		`:method :url :status :res[content-length] - :response-time ms :data`
	)
)

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

function errorCheck(body, res) {
	if (!body.name || !body.number) {
		return { error: 'User name or number is blank.' }
	} else if (
		persons.find(
			(person) => person.name.toLowerCase() === body.name.toLowerCase()
		)
	) {
		return { error: 'Name must be unique.' }
	}
}

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter((person) => person.id !== id)
	res.status(204).end()
})

app.get('/api/persons', (req, res) => {
	Phonebook.find({}).then((phonebook) => {
		res.json(phonebook)
	})
})

app.get('/api/persons/:id', (req, res) => {
	Phonebook.findById(req.params.id).then((person) => {
		res.json(person)
	})
})

app.get('/info', (req, res) => {
	Phonebook.countDocuments({}).then((count) => {
		const info = `<p>Phonebook has info for ${count} people</p><br/>
        ${new Date()}`
		res.send(info)
	})
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	const error = errorCheck(body, res)

	if (error) {
		res.status(400).json(error)
		return
	}
	const person = {
		id: Math.floor(Math.random() * 999999999),
		name: body.name,
		number: body.number
	}
	persons = persons.concat(person)
	res.json(person)
})

app.use(unknownEndpoint)
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
