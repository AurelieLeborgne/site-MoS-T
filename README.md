# MoS-T — Site web du projet

Site vitrine du projet ANR **MoS-T** (Motifs Spatio-Temporels), construit avec [Astro](https://astro.build/) et [Tailwind CSS](https://tailwindcss.com/), déployé sur GitHub Pages.

## Prérequis

- **Node.js ≥ 22** (voir `.nvmrc`)
- npm

```bash
nvm use          # active la bonne version de Node
npm install      # installe les dépendances
```

## Commandes

| Commande          | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Lance le serveur de développement local      |
| `npm run build`   | Compile le site (+ récupère les publications HAL) |
| `npm run preview` | Prévisualise le build localement             |

## Structure du projet

```
src/
├── components/       # Composants réutilisables (Navbar, Footer, MemberCard)
├── data/             # Données (publications.json, auto-généré)
├── i18n/             # Traductions (fr.json, en.json, utils.ts)
├── layouts/          # Layout de base (BaseLayout.astro)
├── pages/
│   ├── fr/           # Pages en français
│   └── en/           # Pages en anglais
└── styles/           # CSS global

public/
├── images/
│   ├── members/      # Photos des membres de l'équipe
│   ├── partners/     # Logos des partenaires (ANR, CNRS, ICube…)
│   └── project/      # Illustrations du projet
└── logos/            # Logos MoS-T (blanc, noir, favicon)

scripts/
└── fetch-hal.mjs     # Script de récupération des publications HAL
```

## Internationalisation (i18n)

Le site est bilingue français/anglais. Chaque page existe en double :

- `src/pages/fr/recherche.astro` ↔ `src/pages/en/research.astro`

Les textes partagés (titres de sections, labels de navigation, etc.) sont dans les fichiers de traduction :

- `src/i18n/fr.json` — Textes français
- `src/i18n/en.json` — Textes anglais

Ils sont accessibles via la fonction `t(lang, 'clé')` dans les pages.

> **Règle importante** : Toute modification de contenu doit être faite dans **les deux langues**.

---

## Guide de mise à jour par section

### 1. Recherche

**Fichiers concernés :**
- `src/i18n/fr.json` et `src/i18n/en.json` (clés `research.*`)
- `src/pages/fr/recherche.astro` et `src/pages/en/research.astro` (structure uniquement)

**Modifier un texte existant :**
Éditer les clés `research.*` dans les deux fichiers JSON (`fr.json` et `en.json`).

**Ajouter un objectif :**
Ajouter une entrée dans le tableau `research.objectives` des deux fichiers JSON.

**Ajouter un work package (ex: WP4) :**
1. Ajouter `{ key: 'wp4', icon: '🔬' }` dans le tableau `workPackages` des **deux fichiers `.astro`**.
2. Ajouter les clés `research.wp4_title` et `research.wp4_desc` dans les **deux fichiers JSON**.

---

### 2. Équipe

**Fichiers concernés :**
- `src/pages/fr/equipe.astro` — Données des membres (FR)
- `src/pages/en/team.astro` — Données des membres (EN)
- `public/images/members/` — Photos

> ⚠️ Les données des membres sont **dupliquées** dans les deux fichiers `.astro` (pas de fichier JSON partagé). Toute modification doit être faite dans les deux fichiers.

**Ajouter un membre :**

1. Placer la photo dans `public/images/members/` (format JPG ou PNG).

2. Ajouter un objet dans le tableau `permanentMembers` ou `nonPermanentMembers` dans **les deux fichiers** :

   Dans `equipe.astro` (FR) :
   ```js
   {
     name: 'Prénom Nom',
     role: 'Maître de conférences',
     affiliation: 'ICube, Université de Strasbourg',
     photo: `${base}/images/members/Prenom.jpg`,
     url: 'https://page-perso.fr',  // optionnel
   }
   ```

   Dans `team.astro` (EN) :
   ```js
   {
     name: 'Prénom Nom',
     role: 'Associate Professor',
     affiliation: 'ICube, University of Strasbourg',
     photo: `${base}/images/members/Prenom.jpg`,
     url: 'https://page-perso.fr',  // optionnel
   }
   ```

3. Si aucune photo n'est fournie, le composant `MemberCard` affiche les initiales sur un cercle coloré.

**Retirer un membre :** Supprimer l'objet correspondant dans les deux fichiers.

---

### 3. Publications

**Fichiers concernés :**
- `src/data/publications.json` — Données (auto-généré)
- `scripts/fetch-hal.mjs` — Script de récupération HAL
- `src/pages/fr/publications.astro` et `src/pages/en/publications.astro` — Affichage

**Fonctionnement :**
Les publications sont **récupérées automatiquement** depuis [HAL](https://hal.science/) via la référence ANR `ANR-21-CE23-0015`. Le script `fetch-hal.mjs` s'exécute à chaque `npm run build` (via `prebuild`).

**Les publications se mettent à jour toutes seules** : dès qu'un article est publié sur HAL avec la bonne référence ANR, il apparaîtra au prochain build.

**Forcer la mise à jour manuellement :**
```bash
node scripts/fetch-hal.mjs
```

**Format d'une publication** (dans `publications.json`) :
```json
{
  "title": "Titre de l'article",
  "authors": ["Auteur 1", "Auteur 2"],
  "date": "2024-05-23",
  "year": 2024,
  "doi": "10.1016/...",
  "halId": "hal-04587869",
  "type": "journal",
  "venue": "Nom de la revue/conférence",
  "url": "https://hal.science/..."
}
```

Types possibles : `journal`, `conf_int` (conférence internationale), `conf_nat` (conférence nationale), `other`.

> ⚠️ **Attention** : les modifications manuelles de `publications.json` seront **écrasées** au prochain build. Pour ajouter une publication hors HAL, il faut modifier le script `fetch-hal.mjs` pour fusionner les entrées manuelles.

---

### 4. Événements

**Fichiers concernés :**
- `src/pages/fr/evenements.astro` — Liste des événements (FR)
- `src/pages/en/events.astro` — Liste des événements (EN)

> ⚠️ Les événements sont **dupliqués** dans les deux fichiers `.astro`. Toute modification doit être faite dans les deux fichiers.

**Ajouter un événement :**

Ajouter un objet dans le tableau `events` des **deux fichiers** :

Dans `evenements.astro` (FR) :
```js
{ date: '2025-09', title: 'Réunion plénière à Strasbourg', type: 'meeting' }
```

Dans `events.astro` (EN) :
```js
{ date: '2025-09', title: 'Plenary meeting in Strasbourg', type: 'meeting' }
```

**Types d'événements :**
| Type          | Badge FR     | Badge EN    |
| ------------- | ------------ | ----------- |
| `meeting`     | Réunion      | Meeting     |
| `publication` | Publication  | Publication |
| autre         | Événement    | Event       |

Les événements sont affichés en **ordre chronologique inversé** (le plus récent en premier).

---

### 5. Ressources

**Fichiers concernés :**
- `src/pages/fr/ressources.astro` — Page FR
- `src/pages/en/resources.astro` — Page EN
- `src/i18n/fr.json` et `src/i18n/en.json` (clés `resources.*`)

**État actuel :** Page placeholder ("Coming soon"). Pour ajouter du contenu :

1. Remplacer les placeholders `{t(lang, 'resources.coming_soon')}` par du vrai contenu (liens vers repos GitHub, datasets, etc.).
2. Modifier les deux fichiers `.astro` et les fichiers JSON si besoin de nouvelles clés.

---

## Ajouter une nouvelle page

1. Créer la page dans `src/pages/fr/` et `src/pages/en/`.
2. Ajouter la route dans `routeMap` dans `src/i18n/utils.ts` (pour le switch de langue).
3. Ajouter les liens dans la `navItems` de `src/components/Navbar.astro`.
4. Ajouter les traductions nécessaires dans `fr.json` et `en.json`.

---

## Déploiement

Le site est déployé automatiquement sur GitHub Pages via GitHub Actions à chaque push sur `main`.

Workflow : `.github/workflows/deploy.yml`

**Processus :**
1. `git add . && git commit -m "description"` — Committer les changements
2. `git push` — Pusher vers GitHub
3. Le build + déploiement se lance automatiquement (~2 min)
4. Le site est accessible à : https://aurelieleborgne.github.io/site-MoS-T/

---

## Chemins des images

Tous les chemins d'images doivent être préfixés par `/site-MoS-T/` :

```js
const base = '/site-MoS-T';
// Exemple : `${base}/images/members/Photo.jpg`
```
