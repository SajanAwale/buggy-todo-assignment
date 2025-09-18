import React from 'react'
import TodoItem from './TodoItem'

export default function TodoList({todos, onDelete, onToggle}){
  return (
    <ul className="todo-list">
      {todos.map((t, i) => (
        // BUG: using index as key
        <TodoItem key={i} todo={t} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </ul>
  )
}
