// ─────────────────────────────────────────────────────────────────
// BLOC : POINT D'ENTRÉE DE L'APPLICATION REACT
//
// Ce fichier est le "déclencheur" : c'est lui que Vite exécute
// en premier. Son seul rôle est de "monter" (render) le composant
// racine <App /> dans la div#root de notre index.html.
//
// DIFFÉRENCE JS PUR :
// En JS pur, on écrivait du code directement dans script.js et
// on manipulait le DOM manuellement (getElementById, appendChild…).
// Ici, ReactDOM.createRoot() prend possession de la div#root et
// c'est React qui gère tout le DOM à partir de maintenant.
// On ne touche plus JAMAIS au DOM directement.
// ─────────────────────────────────────────────────────────────────

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';   // Import du CSS global (appliqué partout)
import App from './App.jsx';

// createRoot() cible la div#root de l'index.html
// StrictMode est un wrapper de développement : il détecte les
// mauvaises pratiques et double les rendus pour repérer les bugs.
// Il n'a aucun impact en production.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
