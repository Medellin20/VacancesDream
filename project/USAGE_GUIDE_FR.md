# 🏠 VacancesDream - Gestion Automatique des Propriétés

## 🎯 Objectif

Vous pouvez maintenant **ajouter, modifier et supprimer** des propriétés dans la page d'administration, et les modifications sont **automatiquement sauvegardées** dans la base de données Supabase sans avoir à télécharger/modifier le JSON manuellement.

## ✨ Nouvelles Fonctionnalités

### ✅ Sauvegarde Automatique
- Les propriétés ajoutées sont immédiatement sauvegardées dans Supabase
- Les modifications sont mises à jour en temps réel
- Les suppressions sont supprimées de la base de données

### ✅ Interface Utilisateur Améliorée
- Messages de succès/erreur visuels
- État de chargement pendant les opérations
- Feedback immédiat après chaque action

### ✅ Système de Fallback
- Si Supabase n'est pas disponible, l'application charge le JSON local
- Les sites publics (Home, PropertyDetail) fonctionnent en mode fallback
- Robustesse accrue contre les pannes réseau

## 🚀 Démarrage Rapide

### 1. Configuration Supabase (À faire une seule fois)

Voir le fichier [SUPABASE_SETUP.md](SUPABASE_SETUP.md) pour les instructions détaillées.

Résumé:
1. Allez à https://app.supabase.com/
2. Ouvrez l'SQL Editor
3. Copiez/collez le contenu de `supabase/migrations/01_create_properties_table.sql`
4. Exécutez la requête

### 2. Démarrer l'Application

```bash
npm install  # Si ce n'est pas déjà fait
npm run dev  # Démarrer le serveur de développement
```

### 3. Accédez à l'Admin

1. Allez à `http://localhost:5173/admin`
2. Mot de passe: `admin123`
3. Ajoutez une propriété et regardez-la être automatiquement sauvegardée!

## 📖 Guide d'Utilisation

### Ajouter une Propriété

1. Cliquez sur le bouton **"Ajouter"** (vert)
2. Remplissez le formulaire:
   - **Titre**: Nom de la propriété
   - **Type**: Maison ou Appartement
   - **Localisation**: Lieu (ex: Nice, Côte d'Azur)
   - **Prix**: Prix par nuit en €
   - **Description**: Détails de la propriété
   - **Chambres, Salles de bain, Superficie**: Caractéristiques
   - **Images**: URLs d'images (voir instructions dans le formulaire)
3. Cliquez sur **"Créer la propriété"**
4. ✅ La propriété est immédiatement sauvegardée!

### Modifier une Propriété

1. Cliquez sur le bouton **éditer** (bleu) sur la propriété
2. Modifiez les champs que vous souhaitez changer
3. Cliquez sur **"Sauvegarder"**
4. ✅ Les changements sont immédiatement appliqués!

### Supprimer une Propriété

1. Cliquez sur le bouton **supprimer** (rouge) sur la propriété
2. Confirmez la suppression
3. ✅ La propriété est supprimée de la base de données!

## 🛠️ Architecture Technique

### Fichiers Modifiés

- **`src/lib/supabaseClient.ts`** ← NOUVEAU
  - Client Supabase et service pour CRUD des propriétés
  
- **`src/pages/Admin.tsx`** ← MODIFIÉ
  - Intégration Supabase
  - Sauvegarde automatique
  - Messages de succès/erreur
  
- **`src/pages/Home.tsx`** ← MODIFIÉ
  - Charge depuis Supabase avec fallback JSON
  
- **`src/pages/PropertyDetail.tsx`** ← MODIFIÉ
  - Charge depuis Supabase avec fallback JSON

### Base de Données

- **Table**: `properties`
- **Colonnes**:
  - `id` (BIGSERIAL) - ID unique
  - `titre` (TEXT) - Nom de la propriété
  - `type` (TEXT) - Maison ou Appartement
  - `localisation` (TEXT) - Localisation
  - `prix` (INTEGER) - Prix par nuit
  - `description` (TEXT) - Description
  - `caracteristiques` (JSONB) - Objet JSON avec chambres, salles de bain, superficie, équipements
  - `images` (TEXT[]) - Array d'URLs d'images
  - `created_at` (TIMESTAMP) - Date de création (auto)
  - `updated_at` (TIMESTAMP) - Date de modification (auto)

## 🔐 Sécurité

- Les politiques RLS permettent la lecture publique
- L'ajout/modification/suppression nécessitent une authentification (mot de passe: admin123)
- Les données sont protégées par Supabase

**Note**: Pour une vraie application de production, implémentez une avec authentification OAuth ou e-mail.

## 📸 Images

Pour ajouter des images aux propriétés:

1. **Option 1 - URLs Pexels** (rapide)
   - Utilisez des URLs d'images de Pexels (ex: `https://images.pexels.com/photos/1396122/...`)
   - Gratuit ✅ Illimité ✅

2. **Option 2 - Images Locales** (meilleur contrôle)
   - Créez un dossier `public/properties/nom-du-bien/`
   - Déposez vos images dedans
   - Utilisez les URLs: `/properties/nom-du-bien/image1.jpg`

3. **Option 3 - Supabase Storage** (recommandé pour production)
   - Configurez Storage dans Supabase
   - Uploadez les images et utilisez les URLs publiques

## 🆘 Dépannage

### "Erreur: No rows found"
→ La table `properties` n'existe pas. Exécutez le SQL dans Supabase (voir SUPABASE_SETUP.md)

### "Erreur: Permission denied"
→ Les politiques RLS ne sont pas configurées correctement. Vérifiez Supabase SQL.

### Les propriétés ne s'affichent pas
→ Vérifiez que `.env` contient les bonnes clés Supabase
→ Ver sifia que la table contient des données

### Les modifications ne se sauvegardent pas
→ Vérifiez la console pour les erreurs (F12 → Console)
→ Vérifiez la connexion internet

## 📞 Support

Voir la documentation complète dans [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

## 🎉 Prêt?

Vous pouvez maintenantadministrer vos propriétés facilement! Les modifications se feront automatiquement. Plus de téléchargement/modification JSON! 🚀
