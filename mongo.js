const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://alexhewitt:${password}@phonebook-cluster.1c3u55n.mongodb.net/?retryWrites=true&w=majority&appName=phonebook-cluster`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	phoneNumber: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
	Person.find({}).then((result) => {
		console.log('Phonebook:\n---------')
		result.forEach((person) => {
			console.log(person.name, person.phoneNumber)
		})
		mongoose.connection.close()
	})
	return
}

const person = new Person({
	name: name,
	phoneNumber: number
})

person.save().then((result) => {
	console.log(`Added ${name} with number ${number} to phonebook.`)
	mongoose.connection.close()
})
// Note.find({}).then((result) => {
// 	result.forEach((note) => {
// 		console.log(note)
// 	})
// 	mongoose.connection.close()
// })
