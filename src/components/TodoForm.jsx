import { useState } from 'react';

export default function TodoForm({ onAdd }) {

  // ── State local : la valeur du champ texte ────────────────────
  // Ce state n'appartient qu'à ce composant — App n'en a pas besoin.
  // On ne remonte que la valeur FINALE (quand l'utilisateur soumet).
  const [inputValue, setInputValue] = useState('');

  // ─────────────────────────────────────────────────────────────
  // GESTION DE LA SOUMISSION DU FORMULAIRE
  // ─────────────────────────────────────────────────────────────
  function handleSubmit(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const trimmed = inputValue.trim();
    if (!trimmed) return; // On ignore les saisies vides

    onAdd(trimmed);
    setInputValue('');
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
        placeholder="Ex : Répondre aux e-mails..."
        value={inputValue}
        /*
          onChange est le cœur du "Controlled Component" :
          à chaque frappe, on met à jour le state "inputValue".
          React ré-affiche le champ avec la nouvelle valeur.
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
