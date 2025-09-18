const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
// INTENTIONAL BUG: CORS not configured securely; wide-open in dev (deliberate)
app.use(cors())

// simple in-memory store
let todos = [
  { _id: uuidv4(), text: 'Sample todo', completed: false }
]

// GET all
app.get('/api/todos', (req, res) => {
  res.json(todos)
})

// POST create
app.post('/api/todos', (req, res) => {
  // BUG: no validation - allows empty, duplicates
  const { text } = req.body
  const t = { _id: uuidv4(), text, completed: false }
  todos.push(t)
  res.status(201).json(t)
})

// PUT update
app.put('/api/todos/:id', (req, res) => {
  const id = req.params.id
  const found = todos.find(t => t._id === id)
  if(!found) return res.status(404).json({error:'not found'})
  // BUG: incorrectly updates property name 'compl' instead of 'completed'
  if(typeof req.body.completed !== 'undefined') found.compl = req.body.completed
  return res.json(found)
})

// DELETE
app.delete('/api/todos/:id', (req, res) => {
  const id = req.params.id
  const before = todos.length
  todos = todos.filter(t => t._id !== id)
  if(todos.length === before) return res.status(404).json({error:'not found'})
  // BUG: returns 204 with JSON body (invalid)
  res.status(204).json({message:'deleted'})
})

app.listen(port, ()=> console.log('Server listening on', port))
