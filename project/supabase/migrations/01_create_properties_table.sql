-- Créer la table properties pour stocker les annonces immobilières
CREATE TABLE IF NOT EXISTS properties (
  id BIGSERIAL PRIMARY KEY,
  titre TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Maison', 'Appartement')),
  localisation TEXT NOT NULL,
  prix INTEGER NOT NULL,
  description TEXT NOT NULL,
  caracteristiques JSONB NOT NULL,
  images TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre à tous de lire les propriétés
CREATE POLICY "Enable read access for all users"
  ON properties FOR SELECT
  USING (true);

-- Policy pour permettre aux administrateurs de modifier les propriétés
-- (vous pouvez améliorer cela avec une vraie authentification d'admin)
CREATE POLICY "Enable all access for properties"
  ON properties FOR ALL
  USING (true);

-- Créer un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE
  ON properties FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
