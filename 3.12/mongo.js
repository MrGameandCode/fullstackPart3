const mongoose = require('mongoose')
//I was having problems with the connection, this got me the idea I had something wrong with it :) mongoose.connection.on('connected', () => console.log('Connected'));

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(0)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackUser:${password}@cluster0.cikkjhn.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    console.log(password)
    mongoose
    .connect(url)
    .then((result) => {
        Person.find({}).then(result => {
            console.log("Phonebook:")
            result.forEach(person => {
                console.log(person.name + " " + person.number)
            })
            mongoose.connection.close()
        })
    })
    .catch((err) => console.log(err))
} else{
    mongoose
    .connect(url)
    .then((result) => {
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
        })
        return person.save()
    })
    .then(() => {
        console.log('added ' + process.argv[3] + " " + process.argv[4] + ' to phonebook')
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}

