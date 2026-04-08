Un jeu de labyrinthe simple pour les enfants.

# Build

## Android (debug APK)

Depuis la racine du projet :

```bash
# Requiert: cordova + Android SDK
./build_app.sh Labyrinthe

# Sortie: Labyrinthe.apk
```

Équivalent (extrait de `build_app.sh`) :

```bash
export ANDROID_HOME=/opt/android-sdk/
cd Labyrinthe
cordova build android
mv platforms/android/app/build/outputs/apk/debug/app-debug.apk ../Labyrinthe.apk
```


# TODO, améliorations & idées
* musiques de fond en fonction du thème

* leaderboard ? Demande un stockage local.

* images libres de droit
* localisation ?

# Bugs
* Zoom sur ordi / pas possible avec la molette
* ne pas planter si une image est manquante... ?