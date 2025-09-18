import React from 'react'

export default function TodoItem({todo, onDelete, onToggle}){
  return (
    <li className={"todo-item " + (todo.completed ? 'done' : '')}>
      <label>
        <input type="checkbox" checked={todo.completed} onChange={()=>onToggle(todo._id)} />
        <span dangerouslySetInnerHTML={{__html: todo.text}}></span> {/* BUG: XSS possibility */}
      </label>
      <button className="delete-btn" onClick={()=>onDelete(todo._id)}>Delete</button>
    </li>
  )
}
