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
	if (!body.name || !body.phoneNumber) {
		return { error: 'User name or number is blank.' }
	}
}

app.delete('/api/persons/:id', (req, res) => {
	Phonebook.findByIdAndDelete(req.params.id)
		.then((result) => {
			res.status(204).end()
		})
		.catch((error) => next(error))
})

app.get('/api/persons', (req, res) => {
	Phonebook.find({}).then((phonebook) => {
		res.json(phonebook)
	})
})

app.get('/api/persons/:id', (req, res) => {
	Phonebook.findById(req.params.id)
		.then((person) => {
			res.json(person)
		})
		.catch((error) => next(error))
})

app.get('/info', (req, res) => {
	Phonebook.countDocuments({})
		.then((count) => {
			const info = `<p>Phonebook has info for ${count} people</p><br/>
        ${new Date()}`
			res.send(info)
		})
		.catch((error) => next(error))
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	const error = errorCheck(body, res)

	if (error) {
		res.status(400).json(error)
		return
	}
	const person = new Phonebook({
		name: body.name,
		phoneNumber: body.phoneNumber
	})
	person.save().then((savedPerson) => {
		res.json(person)
	})
})

app.put('/api/persons/:id', (req, res) => {
	const body = req.body
	const error = errorCheck(body, res)

	if (error) {
		res.status(400).json(error)
		return
	}

	const updatedPerson = {
		name: body.name,
		phoneNumber: body.phoneNumber
	}

	Phonebook.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
		.then((updatedPerson) => {
			res.json(updatedPerson)
		})
		.catch((error) => next(error))
})

function errorHandler(error, request, response, next) {
	console.log(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	next(error)
}

app.use(unknownEndpoint)
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
