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
      via un template string (backticks + expression JS)
    */
    <li className={`todo-item ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>

      {/*
        CHECKBOX :
        onChange est l'équivalent JSX de addEventListener('change')
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