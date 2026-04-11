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

const STORAGE_KEY = 'vacancesDream_properties';

const saveAll = (properties: Property[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
};

const loadFromStorage = (): Property[] | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) as Property[] : null;
};

export const propertyService = {
  async getAll() {
    const local = loadFromStorage();
    if (local && local.length > 0) {
      return local;
    }

    const response = await fetch('/data/properties.json');
    if (!response.ok) {
      throw new Error('Impossible de charger les propriétés locales');
    }

    const data = await response.json() as Property[];
    saveAll(data);
    return data;
  },

  async create(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
    const properties = (await this.getAll()) ?? [];
    const nextId = properties.length > 0 ? Math.max(...properties.map((p) => p.id ?? 0)) + 1 : 1;
    const newProperty: Property = {
      ...property,
      id: nextId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [...properties, newProperty];
    saveAll(updated);
    return newProperty;
  },

  async update(id: number, property: Partial<Property>) {
    const properties = await this.getAll();
    let updatedProperty: Property | null = null;
    const updated = properties.map((item) => {
      if (item.id === id) {
        updatedProperty = {
          ...item,
          ...property,
          updated_at: new Date().toISOString(),
        } as Property;
        return updatedProperty;
      }
      return item;
    });
    if (!updatedProperty) {
      throw new Error('Propriété introuvable');
    }
    saveAll(updated);
    return updatedProperty;
  },

  async delete(id: number) {
    const properties = await this.getAll();
    const filtered = properties.filter((item) => item.id !== id);
    saveAll(filtered);
  },
};
