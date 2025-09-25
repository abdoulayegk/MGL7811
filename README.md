# Abdoulaye Balde – MGL7320 Projet personnel

## Vue d'ensemble

Ce projet fournit un environnement reproductible pour exécuter le notebook `mgl7811-germancreditreport.ipynb` intégralement dans des conteneurs Docker. Les données du jeu **German Credit** sont chargées dans une base MongoDB, puis consommées par JupyterLab via `pymongo`. Toute personne ayant Docker peut cloner le dépôt, lancer la stack et reproduire les analyses.

## Architecture

```
+------------------------+         +-----------------------+
|        JupyterLab      |  -->    |     MongoDB (reports) |
| jupyter/datascience    |         | mongo:6 + volume      |
| - pymongo, pandas      |         | - seeded via script   |
+------------------------+         +-----------------------+
                 ^                          |
                 |                          |
                 +-----------+--------------+
                             |
                    Mongo seed (one-shot)
                    python:3.11-slim
                    - pandas + pymongo
```

- `mongodb` : service principal avec persistance (`mongo-data`).
- `mongo-seed` : conteneur éphémère qui charge `german_credit_data.xls` et alimente la collection `reports`.
- `jupyterlab` : environnement de travail basé sur `jupyter/datascience-notebook`, exposé sur `http://localhost:8888/lab` sans token.

Tous les services communiquent sur le réseau par défaut de Docker Compose. Le jeu de données est monté en lecture seule dans le conteneur de seed.

## Prérequis

- macOS, Linux ou Windows avec prise en charge Docker.
- Docker Desktop _ou_ `docker` + `docker compose` en ligne de commande.
- Ports libres : `8888` (JupyterLab) et `27017` (MongoDB, optionnel si vous n'exposez pas le port).

## Démarrage rapide

```fish
cd mgl7320-20253-perso-docker-abdoulayegk/Notebook
docker compose up --build
```

- Sur le premier lancement, le service `mongo-seed` attend que Mongo soit prêt, puis insère les documents. Le conteneur se termine une fois le chargement effectué.
- Accédez à `http://localhost:8888/lab` ; aucune authentification n'est requise.
- Ouvrez le notebook `mgl7811-germancreditreport.ipynb` dans le dossier `work/`.
- Exécutez les premières cellules pour vérifier la connexion MongoDB (un message affiche le nombre de documents chargés).

### Lancer toute la démo en une seule commande

```fish
./scripts/run_demo.sh
```

Cette commande vérifie que le port `8888` est libre, construit les images si nécessaire et démarre les conteneurs en arrière-plan. Une fois l'environnement prêt, ouvrez `http://localhost:8888/lab` pour accéder à JupyterLab.

### Relancer le seed

Si vous devez recharger les données (par exemple après les avoir modifiées) :

```fish
docker compose run --rm mongo-seed
```

### Arrêter et nettoyer

```fish
docker compose down
```

Pour supprimer également les volumes (et donc les données MongoDB) :

```fish
docker compose down -v
```

## Structure des fichiers

```
.
├── docker-compose.yml
├── README.md
├── german_credit_data.xls
├── mgl7811-germancreditreport.ipynb
├── docker/
│   ├── jupyterlab/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   └── mongo-seed/
│       ├── Dockerfile
│       └── requirements.txt
└── scripts/
    ├── run_demo.sh
    └── seed_database.py
```

## Variables d'environnement

- `MONGO_URI` : URL de connexion utilisée par JupyterLab et le script de seed (défaut `mongodb://mongodb:27017/german_credit`).
- `DATASET_PATH` : chemin du dataset pour le seed (`/app/german_credit_data.xls` via montage). Modifiez-le si vous changez la source ou le nom du fichier.

Pour introduire une authentification MongoDB, ajoutez `MONGO_INITDB_ROOT_USERNAME` et `MONGO_INITDB_ROOT_PASSWORD` dans `docker-compose.yml`, puis mettez à jour l'URI correspondant.

## Tests rapides

1. Lancer la stack (`docker compose up --build`).
2. Vérifier dans les logs que `Seeded ... documents` est affiché.
3. Ouvrir le notebook et exécuter la première cellule : la sortie doit indiquer le nombre de documents et aucune erreur.
4. Optionnel : connecter `mongosh` ou `MongoDB Compass` à `mongodb://localhost:27017` pour vérifier la collection `reports`.

## Bonnes pratiques Git

- Travaillez sur une branche de fonctionnalité (ex. `feature/docker-mongo`) puis fusionnez dans `main` après revue.
- Ne conservez dans `main` que les fichiers nécessaires (supprimez les fichiers temporaires, checkpoints Jupyter, etc.).
- Ajoutez un `.gitignore` pour exclure `__pycache__/`, `.ipynb_checkpoints/` et autres artefacts.

## Ressources utiles

- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [MongoDB Python Driver (`pymongo`)](https://pymongo.readthedocs.io/)
- [Images Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/)

---

Projet réalisé par **Abdoulaye Balde** dans le cadre du cours MGL7320 (Automne 2025).
