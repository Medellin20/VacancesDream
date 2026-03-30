import { MapPin, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  id: number;
  titre: string;
  type: string;
  localisation: string;
  prix: number;
  images: string[];
  caracteristiques: {
    chambres: number;
    sallesDeBain: number;
    superficie: number;
  };
}

export default function PropertyCard({ id, titre, type, localisation, prix, images, caracteristiques }: PropertyCardProps) {
  return (
    <Link to={`/property/${id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-64 overflow-hidden">
          <img
            src={images[0]}
            alt={titre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              {type}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {prix}€/nuit
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {titre}
          </h3>

          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-1 text-blue-600" />
            <span className="text-sm">{localisation}</span>
          </div>

          <div className="flex items-center justify-between text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-1">
              <Bed className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{caracteristiques.chambres} ch.</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{caracteristiques.sallesDeBain} sdb.</span>
            </div>
            <div className="flex items-center space-x-1">
              <Square className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{caracteristiques.superficie}m²</span>
            </div>
          </div>

          <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 transform group-hover:scale-105">
            Voir détails
          </button>
        </div>
      </div>
    </Link>
  );
}
