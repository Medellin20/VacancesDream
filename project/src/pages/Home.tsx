import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { propertyService, Property } from '../lib/supabaseClient';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [priceRange, setPriceRange] = useState('Tous');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await propertyService.getAll();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Erreur chargement données:', error);
        // Fallback: charger depuis le JSON si Supabase n'est pas disponible
        fetch('/data/properties.json')
          .then((response) => response.json())
          .then((data) => {
            setProperties(data);
            setFilteredProperties(data);
          })
          .catch((err) => console.error('Erreur chargement fallback:', err));
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.localisation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'Tous') {
      filtered = filtered.filter((property) => property.type === filterType);
    }

    if (priceRange !== 'Tous') {
      if (priceRange === '0-150') {
        filtered = filtered.filter((property) => property.prix <= 150);
      } else if (priceRange === '150-250') {
        filtered = filtered.filter((property) => property.prix > 150 && property.prix <= 250);
      } else if (priceRange === '250+') {
        filtered = filtered.filter((property) => property.prix > 250);
      }
    }

    setFilteredProperties(filtered);
  }, [searchTerm, filterType, priceRange, properties]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fadeIn">
            Trouvez votre location de rêve
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl animate-fadeIn">
            Des maisons et appartements exceptionnels pour des vacances inoubliables
          </p>

          <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl p-4 animate-slideUp">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par ville ou titre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span className="font-medium">Filtres</span>
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 animate-slideDown">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de bien
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option>Tous</option>
                    <option>Maison</option>
                    <option>Appartement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gamme de prix
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option>Tous</option>
                    <option value="0-150">0 - 150€</option>
                    <option value="150-250">150 - 250€</option>
                    <option value="250+">250€+</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {filteredProperties.length} {filteredProperties.length > 1 ? 'propriétés disponibles' : 'propriété disponible'}
          </h2>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Aucune propriété ne correspond à vos critères</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id || 0} {...property} id={property.id || 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
