import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Property {
  id?: number;
  titre: string;
  type: string;
  localisation: string;
  prix: number;
  description: string;
  caracteristiques: {
    chambres: number;
    sallesDeBain: number;
    superficie: number;
    equipements: string[];
  };
  images: string[];
  created_at?: string;
  updated_at?: string;
}

// Fonctions CRUD pour les propriétés
export const propertyService = {
  // Récupérer toutes les propriétés
  async getAll() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data as Property[];
  },

  // Ajouter une nouvelle propriété
  async create(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single();

    if (error) throw error;
    return data as Property;
  },

  // Mettre à jour une propriété
  async update(id: number, property: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Property;
  },

  // Supprimer une propriété
  async delete(id: number) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
