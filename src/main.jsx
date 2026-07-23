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
