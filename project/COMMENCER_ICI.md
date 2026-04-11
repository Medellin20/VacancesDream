# 🚀 COMMENCER ICI

## ⚡ TL;DR - 3 Étapes Rapides

### 1️⃣ Configurer Supabase (5 minutes)

```sql
-- Allez sur https://app.supabase.com/
-- Sélectionnez votre projet
-- Ouvrez SQL Editor
-- Collez ce code:
```

[Voir le contenu complet dans `supabase/migrations/01_create_properties_table.sql`]

OU plus simple:
1. Ouvrez le fichier `supabase/migrations/01_create_properties_table.sql`
2. Copiez tout le contenu
3. Allez à https://app.supabase.com/ → SQL Editor
4. Collez et exécutez

> Si vous utilisez l’upload d’images depuis l’admin, créez aussi un bucket Supabase Storage public nommé `property-images`.
> Vous pouvez aussi définir `VITE_SUPABASE_STORAGE_BUCKET` dans votre fichier `.env` si vous voulez un autre nom de bucket.

### 2️⃣ Démarrer l'app

```bash
npm run dev
```

### 3️⃣ Tester

1. Allez à http://localhost:5173/admin
2. Mot de passe: `admin123`
3. Cliquez "Ajouter" et créez une propriété
4. ✨ Automatiquement sauvegardée!

---

## 📖 Si besoin de plus d'infos

| Fichier | Pour |
|---------|------|
| [README_NOUVEAU.md](README_NOUVEAU.md) | Vue d'ensemble complète |
| [SETUP_CHECKLIST_FR.md](SETUP_CHECKLIST_FR.md) | Checklist détaillée de mise en place |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Guide complet Supabase |
| [USAGE_GUIDE_FR.md](USAGE_GUIDE_FR.md) | Comment utiliser l'app |
| [CHANGELOG_FR.md](CHANGELOG_FR.md) | Ce qui a changé |

---

## 🔑 Points Importants

✅ Les modifications se sauvent **automatiquement** dans Supabase  
✅ Plus besoin de télécharger/modifier le JSON  
✅ Les utilisateurs voient les changements en temps réel  
✅ Pas de nouvelles dépendances (Supabase était déjà installé)  

---

## 🆘 Ça Ne Marche Pas?

### Si vous voyez une erreur "No rows found"
1. Allez sur Supabase
2. Ouvrez SQL Editor
3. Collez le contenu de `supabase/migrations/01_create_properties_table.sql`
4. Exécutez
5. Rafraîchissez à `http://localhost:5173/admin`

### Si les propriétés n'apparaissent pas
1. Ouvrez la console (F12 → Console)
2. Vérifiez s'il y a une erreur
3. Vérifiez que votre `.env` a les bonnes clés Supabase

---

**Besoin d'aide complète?** Consultez [SETUP_CHECKLIST_FR.md](SETUP_CHECKLIST_FR.md)

**Lancez-vous! 🚀**
