import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

// Clé utilisée pour identifier nos données dans le localStorage
const STORAGE_KEY = 'summerGoals2026_react';

// ─────────────────────────────────────────────────────────────────
// BLOC : CHARGEMENT INITIAL DEPUIS LE LOCALSTORAGE (Lazy Initializer)
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

export default function App() {

  // ── STATE 1 : La liste des objectifs ──────────────────────────
  const [todos, setTodos] = useState(loadFromLocalStorage);

  // ── STATE 2 : Le filtre actif ──────────────────────────────────
  // 3 valeurs possibles : 'all' | 'active' | 'completed'
  const [filter, setFilter] = useState('all');

  // ─────────────────────────────────────────────────────────────
  // BLOC : SAUVEGARDE AUTOMATIQUE AVEC useEffect
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]); // Ce tableau s'appelle le "tableau de dépendances"

  // ─────────────────────────────────────────────────────────────
  // BLOC : FONCTION AJOUTER UN OBJECTIF
  //─────────────────────────────────────────────────────────────
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

  // Objectifs filtrés selon le filtre actif
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // Compte les objectifs non complétés (pour le compteur)
  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app-wrapper">
      <div className="app-card">

        {/* ── EN-TÊTE ── */}
        <header className="app-header">
          <h1 className="app-title">🌞 Mes Objectifs</h1>
          <p className="app-subtitle">Travail · Perso · Projets</p>
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