const express = require('express')
const app = express()

let persons =  [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Lara Croft",
      "number": "24-95-647251",
      "id": 6
    },
    {
      "name": "Bruce Wayne",
      "number": "05-5-976913",
      "id": 7
    }
  ]

app.get('/api/persons', (request, response) => {
  response.json(persons)
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