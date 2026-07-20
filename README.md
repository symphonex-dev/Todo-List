# 🌞 Mes Objectifs de l'Été 2026 — Version React

Application de gestion d'objectifs personnels (code, sport, projets) construite avec **React 18 + Vite**. Projet d'apprentissage avec code intégralement commenté par blocs.

---

## 📁 Arborescence du projet

```
summer-goals-react/
│
├── index.html              ← Point d'entrée HTML (une seule div#root)
├── package.json            ← Dépendances et scripts npm
├── vite.config.js          ← Configuration Vite + plugin React
├── README.md               ← Ce fichier
│
└── src/
    ├── main.jsx            ← Monte <App /> dans le DOM via ReactDOM
    ├── App.jsx             ← Composant racine : state, localStorage, filtres
    ├── index.css           ← Styles globaux (thème sombre, design system)
    │
    └── components/
        ├── TodoForm.jsx    ← Formulaire d'ajout (controlled input)
        ├── TodoList.jsx    ← Boucle .map() sur les todos filtrés
        └── TodoItem.jsx    ← Une ligne : checkbox + texte + bouton ×
```

---

## ⚙️ Prérequis

- **Node.js** version 18 ou supérieure → [Télécharger Node.js](https://nodejs.org)
- **npm** (inclus avec Node.js)

Vérifie tes versions installées :
```bash
node --version   # doit afficher v18.x.x ou supérieur
npm --version    # doit afficher 9.x.x ou supérieur
```

---

## 🚀 Lancer le projet en local

### Étape 1 — Installer les dépendances
```bash
cd summer-goals-react
npm install
```
> Cette commande lit le `package.json` et télécharge React, Vite et leurs plugins dans un dossier `node_modules/`.

### Étape 2 — Démarrer le serveur de développement
```bash
npm run dev
```
> Vite démarre un serveur local ultra-rapide avec **Hot Module Replacement** (HMR) : toute modification de fichier se reflète instantanément dans le navigateur sans rechargement.

### Étape 3 — Ouvrir dans le navigateur
```
http://localhost:5173
```

---

## 📦 Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement local |
| `npm run build` | Compile l'app pour la production (dossier `dist/`) |
| `npm run preview` | Prévisualise le build de production en local |

---

## 🧠 Concepts React illustrés dans ce projet

| Concept | Fichier | Description |
|---|---|---|
| `useState` | `App.jsx` | State central des todos et du filtre actif |
| `useState` lazy init | `App.jsx` | Chargement unique depuis localStorage au démarrage |
| `useEffect` | `App.jsx` | Sauvegarde auto dans localStorage à chaque modif |
| Props (données) | `TodoList.jsx` | Réception du tableau `todos[]` depuis App |
| Props (callbacks) | `TodoItem.jsx` | Réception de `onDelete` et `onToggle` depuis App |
| Controlled Input | `TodoForm.jsx` | `value` + `onChange` pilotés par le state React |
| Rendu conditionnel | `TodoList.jsx` | Affichage du message vide si tableau vide |
| Rendu de liste | `TodoList.jsx` | `.map()` + prop `key` obligatoire |
| Classe dynamique | `TodoItem.jsx` | `className` calculée selon `todo.completed` |

---

## 💾 Persistance des données

Les objectifs sont sauvegardés dans le **localStorage** du navigateur sous la clé `summerGoals2026_react`. Ils survivent aux rechargements de page et aux fermetures du navigateur.

Pour réinitialiser la liste :
```js
// Dans la console du navigateur (F12)
localStorage.removeItem('summerGoals2026_react')
```

---

## 🗺️ Flux de données (schéma)

```
App.jsx  ──── state: [todos], filter
  │
  ├──→ TodoForm.jsx     reçoit : onAdd()
  │
  └──→ TodoList.jsx     reçoit : todos[], onDelete(), onToggle()
          │
          └──→ TodoItem.jsx (×N)   reçoit : todo, onDelete(), onToggle()
```

Les données descendent via les **props**, les événements remontent via les **callbacks**. C'est le principe fondamental de React : flux unidirectionnel.
