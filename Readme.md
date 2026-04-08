Un jeu de labyrinthe simple pour les enfants.

# Build

## Android (debug APK)

Depuis la racine du projet :

```bash
# Requiert: cordova + Android SDK
./build_app.sh Labyrinthe

# Sortie: Labyrinthe.apk
```

(Le script exporte ANDROID_HOME et lance `cordova build android`.)

# TODO, améliorations & idées
* musiques de fond en fonction du thème

* leaderboard ? Demande un stockage local.

* images libres de droit
* localisation ?

# Bugs
* Zoom sur ordi / pas possible avec la molette
* ne pas planter si une image est manquante... ?