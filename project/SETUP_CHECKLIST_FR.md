# ✅ Checklist - Mise en Place de la Sauvegarde Automatique

## 📋 Avant de Commencer

Assurez-vous que:
- [ ] Vous avez accès à Supabase (https://app.supabase.com/)
- [ ] Vous connaissez vos identifiants Supabase
- [ ] Vous avez les variables d'environnement dans `.env`:
  ```
  VITE_SUPABASE_URL=https://...
  VITE_SUPABASE_ANON_KEY=...
  ```

## 🔧 Configuration Supabase (À faire une seule fois)

### Étape 1: Créer la Table
- [ ] Allez à https://app.supabase.com/
- [ ] Sélectionnez votre projet VacancesDream
- [ ] Allez dans **SQL Editor**
- [ ] Cliquez sur **New Query**
- [ ] Copiez le contenu de `supabase/migrations/01_create_properties_table.sql`
- [ ] Collez dans l'éditeur SQL
- [ ] Cliquez **Run** (Ctrl+Enter)
- [ ] Vérifiez que la requête s'exécute sans erreur

### Étape 2: Vérifier la Table
- [ ] Allez dans **Table Editor**
- [ ] Vérifiez que la table `properties` existe
- [ ] Vérifiez que les colonnes sont correctes:
  - [ ] `id` (BIGSERIAL)
  - [ ] `titre` (TEXT)
  - [ ] `type` (TEXT)
  - [ ] `localisation` (TEXT)
  - [ ] `prix` (INTEGER)
  - [ ] `description` (TEXT)
  - [ ] `caracteristiques` (JSONB)
  - [ ] `images` (TEXT[])
  - [ ] `created_at` (TIMESTAMP)
  - [ ] `updated_at` (TIMESTAMP)

### Étape 3: (Optionnel) Importer les Propriétés Existantes
Si vous avez des propriétés dans `public/data/properties.json`:
- [ ] Ouvrez le fichier JSON
- [ ] Allez dans Supabase **Table Editor**
- [ ] Cliquez sur la table `properties`
- [ ] Ajoutez les propriétés manuellement ou utilisez l'import CSV

## 🚀 Tester l'Application

### Étape 1: Démarrer le serveur
```bash
cd /root/VacancesDream/project
npm run dev
```

### Étape 2: Accéder à l'administration
- [ ] Allez à `http://localhost:5173/admin`
- [ ] Connectez-vous avec le mot de passe: `admin123`
- [ ] Vous devriez voir le message:
  ```
  ✓ Connexion à la base de données active
  ```

### Étape 3: Ajouter une Propriété Test
- [ ] Cliquez sur le bouton **Ajouter**
- [ ] Remplissez le formulaire avec les données suivantes:
  - **Titre**: "Test - Propriété De Test"
  - **Type**: "Maison"
  - **Localisation**: "Test, Test"
  - **Prix**: 100
  - **Description**: "Description de test"
  - **Chambres**: 1
  - **Salles de bain**: 1
  - **Superficie**: 50
  - **Images**: Collez une URL d'image (ex: `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600`)
- [ ] Cliquez sur **Créer la propriété**
- [ ] Vous devriez voir: **"Propriété ajoutée avec succès!"**
- [ ] La propriété doit disparaître du formulaire

### Étape 4: Vérifier dans Supabase
- [ ] Allez dans Supabase **Table Editor**
- [ ] Sélectionnez la table `properties`
- [ ] Vérifiez que votre propriété test a été créée
- [ ] Vérifiez que les colonnes `created_at` et `updated_at` sont remplies

### Étape 5: Vérifier sur la Page d'Accueil
- [ ] Allez à `http://localhost:5173/`
- [ ] Vous devriez voir votre propriété test dans la liste
- [ ] Cliquez sur la propriété pour vérifier les détails

### Étape 6: Tester la Modification
- [ ] Retournez à `/admin`
- [ ] Modifiez la propriété test:
  - Changez le titre ou le prix
  - Cliquez **Sauvegarder**
  - Vous devriez voir: **"Propriété mise à jour avec succès!"**
- [ ] Retournez à la page d'accueil et vérifiez que les modifications apparaissent

### Étape 7: Tester la Suppression
- [ ] Retournez à `/admin`
- [ ] Cliquez sur le bouton **supprimer** pour la propriété test
- [ ] Confirmez la suppression
- [ ] Vous devriez voir: **"Propriété supprimée avec succès!"**
- [ ] Vérifiez qu'elle n'apparaît plus sur la page d'accueil

## ✨ Succès!

Si toutes les étapes sont complètes:
- [ ] ✅ Ajouter une propriété → Sauvegarde dans Supabase
- [ ] ✅ Modifier une propriété → Mise à jour dans Supabase
- [ ] ✅ Supprimer une propriété → Suppression dans Supabase
- [ ] ✅ Les modifications apparaissent immédiatement sur le site
- [ ] ✅ Les messages de succès s'affichent

## 🆘 Dépannage

### Erreur: "Failed to connect to Supabase"
1. Vérifiez que `.env` a les bonnes clés
2. Vérifiez votre connexion internet
3. Vérifiez que Supabase est accessible

### Erreur: "No rows found"
1. La table `properties` n'existe pas
2. Réexécutez le script SQL dans Supabase

### Les propriétés ne s'affichent pas
1. Vérifiez que la table a des données dans Supabase
2. Ouvrez la console (F12 → Console) pour voir les erreurs
3. Vérifiez le onglet Network pour les requêtes

### La page se bloque lorsque j'ajoute une propriété
1. Vérifiez la console pour les erreurs
2. Assurez-vous que vous avez au moins 1 image
3. Vérifiez que les champs obligatoires sont remplis

## ℹ️ Informations Utiles

- **Fichiers documentations**:
  - [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Guide complet de configuration
  - [USAGE_GUIDE_FR.md](USAGE_GUIDE_FR.md) - Guide d'utilisation
  - [CHANGELOG_FR.md](CHANGELOG_FR.md) - Résumé des changements

- **Mot de passe admin**: `admin123`
  - ⚠️ Changez-le en production!

- **Mode Fallback**:
  - Si Supabase n'est pas disponible, l'app charge le JSON `public/data/properties.json`
  - C'est pour la robustesse, pas pour un usage permanent en production

## 📞 Besoin d'Aide?

1. Consultez les fichiers de documentation (SUPABASE_SETUP.md, USAGE_GUIDE_FR.md)
2. Vérifiez la console du navigateur (F12)
3. Vérifiez la base de données Supabase
4. Consultez la [documentation Supabase](https://supabase.com/docs)

---

**C'est tout! Vous êtes prêt à utiliser la sauvegarde automatique! 🚀**
