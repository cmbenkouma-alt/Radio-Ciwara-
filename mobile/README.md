# Radio Ciwara App

Application mobile officielle de Radio Ciwara 105.5 FM.

## État du projet

Phase 1 : fondation du projet et lecteur Live Broadcast.

- Android + iOS via Flutter
- Lecteur audio direct basé sur le flux actuellement utilisé par le site
- Identité visuelle Radio Ciwara
- Première interface Direct

## Flux actuel

Le lecteur utilise le même flux configuré dans le site Radio Ciwara. La valeur est centralisée dans `lib/main.dart` afin de pouvoir remplacer facilement le fournisseur plus tard.

## Prochaines étapes

1. Ajouter les 10 écrans de l'application.
2. Extraire les couleurs, logos et ressources en assets locaux.
3. Ajouter la lecture en arrière-plan et les contrôles écran verrouillé.
4. Connecter les actualités/RSS du site.
5. Ajouter programmes, podcasts, dédicaces et contact.
6. Ajouter les liens Play Store / App Store.
7. Mettre en place le build Android et iOS.
