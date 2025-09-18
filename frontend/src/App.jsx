import React, { useEffect, useState } from 'react'
import TodoList from './TodoList'

export default function App(){
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetch('http://localhost:4000/api/todos')
      .then(r => r.json())
      .then(data => setTodos(data))
      .catch(e => console.error('Failed to load todos', e))
  }, [])

  const addTodo = async (text) => {
    // BUG: allows empty strings and doesn't trim input
    const res = await fetch('http://localhost:4000/api/todos', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ text })
    })
    const newTodo = await res.json()
    setTodos([...todos, newTodo]) // using index keys in list will cause issues
  }

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:4000/api/todos/${id}`, { method: 'DELETE' })
    // BUG: directly mutating state by filtering wrong variable name
    const updated = todos.filter(t => t._id !== id)
    setTodos(updated)
  }

  const toggle = async (id) => {
    // BUG: toggling locally without using server response; and uses index as key in child
    const t = todos.find(x => x._id === id)
    if(!t) return
    const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ completed: !t.completed })
    })
    const updated = await res.json()
    // BUG: may cause stale state issues by referencing old todos
    setTodos(todos.map(td => td._id === id ? updated : td))
  }

  return (
    <div className="app">
      <h1>Buggy ToDo App</h1>
      <AddForm onAdd={addTodo} />
      <TodoList todos={todos} onDelete={deleteTodo} onToggle={toggle} />
    </div>
  )
}

function AddForm({onAdd}){
  const [v, setV] = useState('')
  return (
    <div className="add-form">
      <input value={v} onChange={e=>setV(e.target.value)} placeholder="Add todo"/>
      <button onClick={()=>{
        onAdd(v) // BUG: not trimming, allows empty
        setV('')
      }}>Add</button>
    </div>
  )
}
