// ─────────────────────────────────────────────────────────────────
// BLOC : IMPORTS
//
// On importe les hooks React dont on a besoin :
//   • useState  → pour gérer les données réactives (todos, filter)
//   • useEffect → pour exécuter du code en réaction à un changement
//
// On importe aussi les composants enfants qu'App va orchestrer.
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

// Clé utilisée pour identifier nos données dans le localStorage
const STORAGE_KEY = 'summerGoals2026_react';

// ─────────────────────────────────────────────────────────────────
// BLOC : CHARGEMENT INITIAL DEPUIS LE LOCALSTORAGE (Lazy Initializer)
//
// Cette fonction est passée à useState() pour initialiser le state.
// L'astuce : en passant une FONCTION à useState (et non une valeur),
// React ne l'exécute qu'UNE seule fois, au premier rendu.
// Si on avait écrit : useState(JSON.parse(localStorage.getItem(...))),
// le localStorage serait lu à CHAQUE rendu → moins performant.
// ─────────────────────────────────────────────────────────────────
function loadFromLocalStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // JSON.parse() reconvertit la chaîne stockée en tableau JS
    return stored ? JSON.parse(stored) : [];
  } catch {
    // Si les données sont corrompues, on repart d'un tableau vide
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────
// COMPOSANT APP — LE COMPOSANT PARENT (Racine)
//
// App est le "chef d'orchestre" : il possède l'état central et
// distribue les données et fonctions à ses composants enfants
// via les PROPS.
//
// POURQUOI mettre le state ici et pas dans les enfants ?
// → Principe de "Lifting State Up" : quand plusieurs composants
//   ont besoin des mêmes données (ex: TodoList ET le compteur
//   ont besoin de "todos"), on remonte le state au plus proche
//   ancêtre commun, ici App.
// ─────────────────────────────────────────────────────────────────
export default function App() {

  // ── STATE 1 : La liste des objectifs ──────────────────────────
  // DIFFÉRENCE JS PUR :
  // En JS pur, on avait un simple tableau let goals = []  qu'on
  // modifiait directement. Ici, chaque modification passe par
  // setTodos() : React détecte le changement et RE-REND
  // automatiquement l'interface. Plus besoin de renderGoals() !
  const [todos, setTodos] = useState(loadFromLocalStorage);

  // ── STATE 2 : Le filtre actif ──────────────────────────────────
  // 3 valeurs possibles : 'all' | 'active' | 'completed'
  const [filter, setFilter] = useState('all');

  // ─────────────────────────────────────────────────────────────
  // BLOC : SAUVEGARDE AUTOMATIQUE AVEC useEffect
  //
  // useEffect(callback, [dépendances]) exécute le callback
  // APRÈS chaque rendu où une dépendance a changé.
  //
  // Ici : à chaque fois que "todos" change (ajout, suppression,
  // coche), React re-rend le composant et ENSUITE exécute ce
  // useEffect pour synchroniser le localStorage.
  //
  // DIFFÉRENCE JS PUR :
  // En JS pur, on appelait manuellement saveGoals() à la fin de
  // chaque fonction (addGoal, deleteGoal, toggleGoal...).
  // Ici, useEffect fait ce travail automatiquement : on ne peut
  // pas oublier de sauvegarder, c'est garanti par React.
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]); // Ce tableau s'appelle le "tableau de dépendances"

  // ─────────────────────────────────────────────────────────────
  // BLOC : FONCTION AJOUTER UN OBJECTIF
  //
  // DIFFÉRENCE JS PUR :
  // En JS pur : goals.push(newGoal) puis on appelait renderGoals()
  // pour reconstruire manuellement le DOM.
  // En React : setTodos([...todos, newGoal]) crée un NOUVEAU
  // tableau (on ne mute jamais le state directement !), React
  // détecte la différence et met à jour le DOM tout seul.
  //
  // L'opérateur spread "..." copie tous les éléments existants
  // du tableau dans le nouveau → on ne perd rien.
  // ─────────────────────────────────────────────────────────────
  function addTodo(text) {
    const newTodo = {
      id: Date.now(),         // Identifiant unique basé sur le timestamp
      text: text.trim(),
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  }

  // ─────────────────────────────────────────────────────────────
  // BLOC : FONCTION SUPPRIMER UN OBJECTIF
  //
  // On filtre le tableau pour retirer l'élément dont l'id
  // correspond. filter() retourne toujours un NOUVEAU tableau
  // (bonne pratique React : immutabilité du state).
  // ─────────────────────────────────────────────────────────────
  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  // ─────────────────────────────────────────────────────────────
  // BLOC : FONCTION BASCULER L'ÉTAT COMPLÉTÉ
  //
  // map() crée un nouveau tableau en modifiant seulement l'élément
  // dont l'id correspond. Le spread "...todo" copie toutes les
  // propriétés existantes, puis on écrase uniquement "completed".
  // ─────────────────────────────────────────────────────────────
  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // ── Mettre à jour le texte d'un objectif (Double-clic) ───────
  function editTodo(id, newText) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
  }

  // ── Réinitialiser la liste (Tout décocher) ────────────────────
  function resetAllTodos() {
    setTodos((prev) =>
      prev.map((todo) => ({ ...todo, completed: false }))
    );
  }

  // ── Supprime tous les objectifs accomplis en une fois ─────────
  function clearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }

  // ─────────────────────────────────────────────────────────────
  // BLOC : CALCUL DES DONNÉES DÉRIVÉES
  //
  // Ces valeurs sont calculées à partir du state existant.
  // On ne crée pas de nouveau state pour elles : elles sont
  // simplement recalculées à chaque rendu (très rapide).
  // ─────────────────────────────────────────────────────────────

  // Objectifs filtrés selon le filtre actif
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // Compte les objectifs non complétés (pour le compteur)
  const remainingCount = todos.filter((todo) => !todo.completed).length;

  // ─────────────────────────────────────────────────────────────
  // BLOC : JSX — LA STRUCTURE VISUELLE DU COMPOSANT
  //
  // DIFFÉRENCE JS PUR :
  // En JS pur, le HTML était dans index.html et on le manipulait
  // via document.createElement, innerHTML, appendChild…
  // En React, le HTML EST dans le JS sous forme de JSX.
  // JSX ressemble à du HTML mais c'est du JavaScript : React le
  // convertit en appels à document.createElement() sous le capot.
  //
  // PASSAGE DE PROPS :
  // On passe nos fonctions (addTodo, deleteTodo, toggleTodo) aux
  // composants enfants comme des attributs HTML. Les enfants
  // peuvent ainsi "remonter" des événements vers App.
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">
      <div className="app-card">

        {/* ── EN-TÊTE ── */}
        <header className="app-header">
          <h1 className="app-title">🌞 Mes Objectifs</h1>
          <p className="app-subtitle">Code · Sport · Projets</p>
        </header>

        {/* ── FORMULAIRE D'AJOUT ──
            On passe la fonction addTodo en prop pour que TodoForm
            puisse déclencher l'ajout d'un todo dans App. */}
        <TodoForm onAdd={addTodo} />

        {/* ── BARRE DE FILTRES ── */}
        <div className="filter-bar">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Tous' : f === 'active' ? 'En cours' : 'Accomplis'}
            </button>
          ))}
        </div>

        {/* ── LISTE DES OBJECTIFS ──
            On passe les todos filtrés, les fonctions enfant et la fonction d'édition. */}
        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
          onEdit={editTodo}
        />

        {/* ── PIED DE LISTE : compteur + actions de pied de page ── */}
        <footer className="app-footer">
          <span className="counter">
            {remainingCount === 1
              ? '1 objectif restant'
              : `${remainingCount} objectifs restants`}
          </span>
          <div className="footer-actions" style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-reset" onClick={resetAllTodos}>
              🔄 Recommencer ma journée
            </button>
            <button className="btn-clear" onClick={clearCompleted}>
              🗑️ Effacer les accomplis
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}