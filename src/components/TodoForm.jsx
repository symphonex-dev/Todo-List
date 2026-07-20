// ─────────────────────────────────────────────────────────────────
// COMPOSANT : TodoForm
//
// Responsabilité unique : afficher le champ texte et le bouton
// d'ajout, et remonter la valeur saisie vers App via la prop onAdd.
//
// PROPS REÇUES :
//   • onAdd (function) → la fonction addTodo() définie dans App.jsx
//
// DIFFÉRENCE JS PUR :
// En JS pur, on avait un addEventListener('submit', ...) sur le
// formulaire dans script.js, et on lisait la valeur avec
// document.getElementById('goal-input').value.
// En React, on utilise l'attribut JSX "onSubmit" (équivalent du
// addEventListener), et la valeur est contrôlée par le state local
// "inputValue" via "onChange". C'est ce qu'on appelle un
// "Controlled Component" : React est toujours maître de la valeur.
// ─────────────────────────────────────────────────────────────────
import { useState } from 'react';

export default function TodoForm({ onAdd }) {

  // ── State local : la valeur du champ texte ────────────────────
  // Ce state n'appartient qu'à ce composant — App n'en a pas besoin.
  // On ne remonte que la valeur FINALE (quand l'utilisateur soumet).
  const [inputValue, setInputValue] = useState('');

  // ─────────────────────────────────────────────────────────────
  // BLOC : GESTION DE LA SOUMISSION DU FORMULAIRE
  //
  // DIFFÉRENCE JS PUR :
  // En JS pur : event.preventDefault() + goalInput.value = ''
  // En React  : même preventDefault(), mais on réinitialise via
  // setInputValue('') qui met à jour le state → React re-rend
  // le champ avec une valeur vide automatiquement.
  // ─────────────────────────────────────────────────────────────
  function handleSubmit(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const trimmed = inputValue.trim();
    if (!trimmed) return; // On ignore les saisies vides

    onAdd(trimmed);         // On appelle la fonction du parent (App)
    setInputValue('');      // On vide le champ
  }

  return (
    /*
      JSX NOTE : En JSX, "onSubmit" correspond à addEventListener('submit').
      La touche "Entrée" dans un <input> à l'intérieur d'un <form>
      déclenche automatiquement l'événement submit — exactement
      comme en HTML classique, pas besoin de code supplémentaire.
    */
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        placeholder="Ex: Terminer le module React sur Udemy..."
        value={inputValue}
        /*
          onChange est le cœur du "Controlled Component" :
          à chaque frappe, on met à jour le state "inputValue".
          React ré-affiche le champ avec la nouvelle valeur.
          DIFFÉRENCE JS PUR : avant, le DOM gérait la valeur seul.
          Ici, React en est l'unique source de vérité.
        */
        onChange={(e) => setInputValue(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="btn-add" aria-label="Ajouter">
        +
      </button>
    </form>
  );
}
