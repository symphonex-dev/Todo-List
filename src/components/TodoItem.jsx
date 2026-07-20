// ─────────────────────────────────────────────────────────────────
// COMPOSANT : TodoItem
//
// Responsabilité unique : afficher UNE ligne d'objectif avec
// sa checkbox, son texte (ou un champ de saisie s'il est édité)
// et son bouton de suppression.
//
// PROPS REÇUES :
//   • todo     (object)   → { id, text, completed }
//   • onDelete (function) → pour supprimer cet objectif
//   • onToggle (function) → pour basculer son état complété
//   • onEdit   (function) → pour enregistrer les modifications textuelles
//
// DIFFÉRENCE JS PUR :
// En JS pur, la fonction createGoalElement() construisait
// manuellement chaque élément du DOM :
//   const li = document.createElement('li');
//   const checkbox = document.createElement('input');
//   checkbox.addEventListener('change', () => toggleGoal(id));
//   li.appendChild(checkbox);  ... etc.
//
// En React, tout cela s'écrit en JSX directement : on décrit
// à quoi doit ressembler l'élément, React crée le DOM pour nous.
// Les gestionnaires d'événements sont des props JSX (onChange,
// onClick) et non des addEventListener séparés.
// ─────────────────────────────────────────────────────────────────
import { useState } from 'react';

export default function TodoItem({ todo, onDelete, onToggle, onEdit }) {
  // État local pour suivre si cette ligne précise est en train d'être éditée ou non
  const [isEditing, setIsEditing] = useState(false);
  // État local pour contrôler la valeur du texte tapé dans l'input d'édition
  const [editText, setEditText] = useState(todo.text);

  // Gère la validation des modifications
  function handleBlurOrSubmit() {
    if (editText.trim() !== '') {
      onEdit(todo.id, editText);
      setIsEditing(false);
    } else {
      // Si l'utilisateur efface tout le texte, on annule et réinitialise la valeur
      setEditText(todo.text);
      setIsEditing(false);
    }
  }

  // Permet de valider la saisie en appuyant sur la touche "Entrée"
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleBlurOrSubmit();
    } else if (e.key === 'Escape') {
      // Annulation de l'édition avec la touche Échap
      setEditText(todo.text);
      setIsEditing(false);
    }
  }

  return (
    /*
      La classe CSS "completed" est ajoutée conditionnellement
      via un template string (backticks + expression JS).
      DIFFÉRENCE JS PUR : on utilisait li.classList.add('completed').
      En React, on calcule la className directement dans le JSX.
    */
    <li className={`todo-item ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>

      {/*
        CHECKBOX :
        onChange est l'équivalent JSX de addEventListener('change').
        On appelle onToggle avec l'id du todo pour remonter
        l'événement jusqu'à App → App met à jour le state → React
        re-rend uniquement ce qui a changé.
      */}
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Marquer "${todo.text}" comme accompli`}
        disabled={isEditing} // Désactive la case pendant l'édition
      />

      {/* Rendu conditionnel : Input si édition en cours, sinon texte classique */}
      {isEditing ? (
        <input
          type="text"
          className="todo-edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlurOrSubmit}
          onKeyDown={handleKeyDown}
          autoFocus // Force le focus automatique dès que le champ apparaît
        />
      ) : (
        <span 
          className="todo-text" 
          onDoubleClick={() => setIsEditing(true)}
          style={{ cursor: 'pointer' }}
          title="Double-cliquez pour modifier"
        >
          {todo.text}
        </span>
      )}

      {/*
        BOUTON SUPPRESSION :
        onClick est l'équivalent de addEventListener('click').
        On utilise une arrow function pour passer l'id en argument.
        Si on avait écrit onClick={onDelete(todo.id)}, la fonction
        s'exécuterait immédiatement au rendu — l'arrow function
        crée un "wrapper" qui attend le clic réel.
      */}
      <button
        className="btn-delete"
        onClick={() => onDelete(todo.id)}
        aria-label={`Supprimer "${todo.text}"`}
      >
        &times;
      </button>

    </li>
  );
}