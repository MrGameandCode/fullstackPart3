require('dotenv').config()

const express = require('express')
var morgan = require('morgan')
const app = express()
morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return ''
  }
});
app.use(morgan(':method :url :status :response-time ms :body'));
app.use(express.json())
app.use(express.static('build'))

const Person = require('./models/Person')

let persons = []

app.get('/api/persons', (request, response) => {
  Person.find().then(people => {
    persons = people
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {
  if (!request.body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  } else if (!request.body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  const existing = persons.find(entry => entry.name === request.body.name)
  if (existing) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = new Person({
    "name": request.body.name,
    "number": request.body.number,
  })
  person.save()
  .then(person => {
    response.json(person)
  })
  .catch(error => next(error))
  //refresh persons when adding a new contact, just in case someone added a new one on other window
  /*Person.find().then(people => {
    persons = people
  })
  persons.concat(person)
  response.json(person)*/
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(Person.find().then(people => {
      persons = people
    }))
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person), { new: true, runValidators: true, context: 'query' }
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response,next) => {
  Person.find()
  .then(result => {
    response.send(`<p>Phonebook has info for ${result.length} persons</p><p>${new Date()}</p>`)
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })  
  }
  next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})