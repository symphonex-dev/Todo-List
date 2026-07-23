import TodoItem from './TodoItem';

export default function TodoList({ todos, onDelete, onToggle, onEdit }) {

  // ── Cas "liste vide" ──────────────────────────────────────────
  if (todos.length === 0) {
    return (
      <p className="empty-state">
        Aucun objectif ici. Ajoute ton premier défi ! 🚀
      </p>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}