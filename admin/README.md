# Administration Ciwara

Le panneau d'administration est dans `admin/index.html`.

La gestion éditoriale complète des parutions Ciwara Infos est disponible dans `admin/parutions.html` :
- numéro et date de l'édition active
- couverture
- ajout, modification et suppression d'articles
- classement des articles
- page, catégorie, auteur, date, image, résumé et contenu
- statut publié / à la une
- import d'images vers `assets/uploads/`
- sauvegarde directe dans `data/ciwara-info.json` via le Worker

Architecture :
- interface d'administration
- Worker Cloudflare `radio-ciwara-admin-api`
- GitHub comme stockage/versionnement des contenus
- sections éditoriales : Ciwara Infos, parutions, radio, programmes, podcasts, TV, publicités, partenaires, accueil et SEO

Le lecteur Caster.fm n'est pas administré par remplacement de son code : ses identifiants et son intégration existante doivent rester intacts.
