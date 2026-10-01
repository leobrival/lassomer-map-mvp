# L’Asso-Mer — Sciences Dive Map MVP

MVP rapide d’une page de valorisation des sciences participatives autour des coraux suivis en Martinique.

## Fonctionnalités

- Page éditoriale pour 3 Sciences Dive
- Carte interactive Leaflet/OpenStreetMap, alternative libre à Mapbox sans clé API
- Points géolocalisés autour de la Martinique
- Fiche détaillée par corail
- Observations chronologiques avec pagination
- Chiffres clés calculés depuis les données mockées
- Formulaire de remontée simulant une validation avant publication

## Lancer en local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Suite logique WordPress

- Transformer `corals` en Custom Post Type JetEngine : `corail_suivi`
- Créer une relation ou repeater `observations`
- Ajouter un statut de modération : `pending`, `validated`, `rejected`
- Exposer les données via REST API WordPress
- Remplacer les données mockées par un fetch vers l’API


## Direction artistique reprise depuis le site existant

Audit rapide des pages publiques L’Asso-Mer : accueil, offre de prestation, calendrier, actions, recrutements, contact, sensibilisation et pages projets listées dans les sitemaps.

Tokens intégrés dans le MVP :

- Couleur primaire : `#005E79`
- Accent jaune : `#FFD800` / `#F2BF27`
- Cyan : `#00A6CC` / `#00C3C6`
- Fond clair : `#F1F9FF`
- Typographies : `Viga` pour les titres, `Voces` pour les textes
- UI : grands espaces blancs, boutons pilule, cartes arrondies, header proche du site existant

Contenus reflétés : pôles d’action, Sciences Dive, calendrier d’événements, formulaire et footer association.
