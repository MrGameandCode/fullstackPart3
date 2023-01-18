require('dotenv').config()

const express = require('express')
var morgan = require('morgan')
const app = express()
morgan.token('body', (req, res) => {
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  } else{
    return ''
  }
});
app.use(morgan(':method :url :status :response-time ms :body'));
app.use(express.json())
app.use(express.static('build'))

const Person = require('./models/Person')

let persons =  []

app.get('/api/persons', (request, response) => {
  Person.find().then(people => {
      persons = people
      response.json(persons)
    })
})

app.post('/api/persons', (request, response) => {
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
  if(existing){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  const person = {
    "name":request.body.name,
    "number":request.body.number,
    "id": Math.floor(Math.random() * (100000) + 1)
  }
  persons = persons.concat(person)
  console.log(persons)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  if(persons.find(person => (person.id === Number(request.params.id)))){
    persons = persons.filter(function( stored ) {
      return stored.id !== Number(request.params.id);
    })
    response.status(204).end()
  } else{
    response.status(404).end()
  }
})

app.get('/api/persons/:id', (request, response) => {
  if(persons.find(person => (person.id === Number(request.params.id)))){
    response.json(persons.find(person => (person.id === Number(request.params.id))))
  } else{
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} persons</p><p>${new Date()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})