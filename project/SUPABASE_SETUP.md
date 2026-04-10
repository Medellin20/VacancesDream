# Configuration Supabase - Sauvegarde Automatique des Propriétés

## 📋 Étapes à suivre

### 1. Créer la table dans Supabase

1. Allez à https://app.supabase.com/
2. Connectez-vous avec vos identifiants
3. Sélectionnez votre projet VacancesDream
4. Allez dans l'onglet **SQL Editor**
5. Créez une nouvelle requête
6. Copiez et collez le contenu du fichier `supabase/migrations/01_create_properties_table.sql`
7. Cliquez sur **Run** (ou Ctrl+Enter)

### 2. Importer vos propriétés existantes (optionnel)

Si vous avez déjà des propriétés dans le fichier `public/data/properties.json`, vous pouvez les importer automatiquement:

1. Allez dans **Table Editor** dans Supabase
2. Cliquez sur la table `properties`
3. Cliquez sur **Insert Row** pour ajouter les propriétés manuellement, ou
4. Utilisez l'outil d'import CSV pour importer en masse

### 3. Vérifier la configuration

Dans le dashboard Supabase, vous devriez voir:
- ✅ Table `properties` créée
- ✅ Les politiques RLS configurées (Read-Only ou All Access)
- ✅ Colonnes: id, titre, type, localisation, prix, description, caracteristiques (JSON), images (array), created_at, updated_at

### 4. Tester l'application

1. Démarrez votre serveur de développement: `npm run dev`
2. Allez à `http://localhost:5173/admin`
3. Connectez-vous avec le mot de passe: `admin123`
4. Ajoutez une nouvelle propriété
5. Vérifiez que la propriété apparaît immédiatement dans Supabase

## ✨ Fonctionnalités activées

- ✅ **Ajout automatique**: Les nouvelles propriétés sont sauvegardées dans Supabase
- ✅ **Modification automatique**: Les changements sont sauvegardés en temps réel
- ✅ **Suppression automatique**: Les propriétés supprimées disparaissent de la base de données
- ✅ **Messages de succès/erreur**: Feedback visuel sur chaque action
- ✅ **État de chargement**: Les boutons affichent l'état pendant les opérations

## 🔐 Sécurité

- Les politiques RLS permettent la lecture publique des propriétés
- L'ajout, la modification et la suppression nécessitent une authentification (mot de passe admin)
- La table est protégée par les politiques RLS de Supabase

## 📝 Notes

- Les timestamps `created_at` et `updated_at` sont gérés automatiquement
- Les images sont stockées dans un tableau JSON
- Les caractéristiques sont stockées en tant qu'objet JSON pour plus de flexibilité

## 🆘 Dépannage

Si vous rencontrez des erreurs:

1. **Erreur "No rows found"**: Assurez-vous que la table `properties` existe
2. **Erreur "Permission denied"**: Vérifiez que les politiques RLS sont correctement configurées
3. **Erreur de connexion**: Vérifiez que les variables d'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont correctement définies dans `.env`

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Reference API Supabase JavaScript](https://supabase.com/docs/reference/javascript/introduction)
- [Guide RLS Supabase](https://supabase.com/docs/guides/auth/row-level-security)
