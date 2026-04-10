# 🛠️ Installation - Sauvegarde Automatique

## 🎯 Objectif

Configurer la base de données Supabase pour que les propriétés se sauvegardent automatiquement.

## ⚡ Installation Rapide (5 minutes)

### Étape 1: Ouvrir le Script SQL

Ouvrez le fichier:
```
supabase/migrations/01_create_properties_table.sql
```

### Étape 2: Copier le Contenu

Sélectionnez tout et copiez (Ctrl+A, Ctrl+C)

### Étape 3: Aller dans Supabase

1. Allez à **https://app.supabase.com/**
2. Connectez-vous si nécessaire
3. Sélectionnez votre projet **VacancesDream**
4. Cliquez sur **SQL Editor** (menu de gauche)
5. Cliquez sur **New Query**

### Étape 4: Coller et Exécuter

1. Collez le contenu dans l'éditeur (Ctrl+V)
2. Cliquez sur **Run** (ou Ctrl+Enter)
3. ✅ La requête devrait s'exécuter sans erreur

### Étape 5: Vérifier

1. Allez dans **Table Editor**
2. Vous devriez voir une table nommée **`properties`**
3. ✅ C'est bon!

## 🚀 Utiliser l'App

### Démarrer

```bash
npm run dev
```

### Tester

1. Allez à `http://localhost:5173/admin`
2. Mot de passe: `admin123`
3. Cliquez **Ajouter**
4. Remplissez le formulaire
5. Cliquez **Créer la propriété**
6. ✨ La propriété est automatiquement sauvegardée!

### Vérifier dans Supabase

1. Allez dans **Table Editor**
2. Sélectionnez la table `properties`
3. Vous devriez voir votre propriété!

## ✅ Ça Marche?

Si vous voyez:
- ✅ La table dans Supabase
- ✅ Votre propriété test dans la table
- ✅ Le message "Propriété ajoutée avec succès!" dans l'app
- ✅ La propriété sur la page d'accueil

**Félicitations! 🎉 C'est prêt!**

## 🆘 Ça Ne Marche Pas?

### Erreur SQL dans Supabase

- Vérifiez que vous avez copié **tout** le fichier
- Vérifiez qu'il n'y a pas d'erreurs de syntaxe
- Essayez de réexécuter la requête

### "Failed to connect to Supabase" en aout

- Vérifiez que `.env` a `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- Vérifiez votre connexion internet
- Rechargez 

### Les propriétés n'apparaissent pas

- Vérifiez que la table `properties` existe (Table Editor)
- Vérifiez qu'il y a des données dedans
- Ouvrez la console (F12 → Console) pour les erreurs

## 📞 Besoin de Plus?

- **Explications complètes?** Lisez [COMMENCER_ICI.md](COMMENCER_ICI.md)
- **Checklist détaillée?** Lisez [SETUP_CHECKLIST_FR.md](SETUP_CHECKLIST_FR.md)
- **Guide complet?** Lisez [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

---

**C'est tout! 🚀 Vous êtes prêt à utiliser la sauvegarde automatique!**
