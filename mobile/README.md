# Radio Ciwara App

Application mobile officielle de Radio Ciwara 105.5 FM.

## État du projet

La branche `app-foundation` contient la première base Flutter de l'application :

- lecteur Live basé sur le flux actuellement utilisé par le site ;
- identité visuelle Radio Ciwara ;
- écran Direct ;
- navigation Direct / Grille / Podcasts / Actus / Contact ;
- gestion connexion, lecture, pause et erreur du flux ;
- structure Material 3 adaptée aux écrans mobiles Android et iOS.

## Flux live

Le flux est centralisé dans `lib/main.dart` afin de pouvoir remplacer facilement le fournisseur plus tard.

## Développement local

Depuis le dossier `mobile` :

```bash
flutter create .
flutter pub get
flutter run
```

Pour Android :

```bash
flutter build apk --release
```

## Prochaines étapes

1. Finaliser les 10 écrans issus des maquettes Radio Ciwara.
2. Ajouter les données réelles du site : actualités/RSS, grille et podcasts.
3. Ajouter les actions WhatsApp, appel, dédicace et site Web.
4. Ajouter la lecture en arrière-plan et les contrôles multimédias.
5. Ajouter splash screen, icône et métadonnées Android/iOS.
6. Tester sur plusieurs téléphones Android et iPhone.
7. Générer l'APK/AAB et préparer la publication Play Store / App Store.
