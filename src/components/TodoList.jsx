// ─────────────────────────────────────────────────────────────────
// COMPOSANT : TodoList
//
// Responsabilité unique : recevoir le tableau d'objectifs filtrés
// et rendre un <TodoItem> pour chacun.
//
// PROPS REÇUES :
//   • todos    (array)    → liste filtrée des objectifs depuis App
//   • onDelete (function) → deleteTodo() venant de App
//   • onToggle (function) → toggleTodo() venant de App
//   • onEdit   (function) → editTodo() venant de App
//
// DIFFÉRENCE JS PUR :
// En JS pur, la fonction renderGoals() vidait le DOM avec
// goalList.innerHTML = '' puis rebuildait tout avec
// document.createElement + appendChild dans une boucle forEach.
//
// En React, on utilise simplement .map() sur le tableau pour
// générer une liste de composants JSX. React gère lui-même
// quelle partie du DOM doit être mise à jour (via son algorithme
// de "reconciliation" et le Virtual DOM). C'est plus court, plus
// lisible, et infiniment plus performant sur de grandes listes.
// ─────────────────────────────────────────────────────────────────
import TodoItem from './TodoItem';

export default function TodoList({ todos, onDelete, onToggle, onEdit }) {

  // ── Cas "liste vide" ──────────────────────────────────────────
  // DIFFÉRENCE JS PUR :
  // En JS pur : emptyState.style.display = 'block' ou 'none'.
  // En React  : on retourne directement un JSX conditionnel.
  // Pas de manipulation du DOM — React s'occupe de tout.
  if (todos.length === 0) {
    return (
      <p className="empty-state">
        Aucun objectif ici. Ajoute ton premier défi ! 🚀
      </p>
    );
  }

  return (
    /*
      RENDU D'UNE LISTE AVEC .map() :
      On itère sur le tableau "todos" pour créer un composant
      <TodoItem> par élément. C'est l'équivalent React du forEach
      + document.createElement de la version JS pur.

      LA PROP "key" EST OBLIGATOIRE :
      Quand React rend une liste, il a besoin d'un identifiant
      unique par élément pour savoir lequel a changé, été ajouté
      ou supprimé, sans avoir à tout re-rendre. On utilise l'id
      unique de chaque todo (jamais l'index du tableau, car les
      index changent quand on supprime un élément !).

      PASSAGE DES CALLBACKS (onDelete, onToggle, onEdit) :
      On "redescend" les fonctions du parent (App) vers chaque
      TodoItem via ses props. C'est le flux de données React :
      données vers le bas (props), événements vers le haut (callbacks).
    */
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