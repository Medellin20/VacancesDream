import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Wifi, Wind, Waves, Car, Trees, Home as HomeIcon, X, ChevronLeft, ChevronRight, Check, MessageCircle } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import ContactAgentModal from '../components/ContactAgentModal';
import ContactFab from '../components/ContactFab';
import { propertyService, Property } from '../lib/propertyService';

const equipmentIcons: { [key: string]: React.ReactNode } = {
  'Wi-Fi': <Wifi className="h-5 w-5" />,
  'Climatisation': <Wind className="h-5 w-5" />,
  'Piscine privée': <Waves className="h-5 w-5" />,
  'Parking': <Car className="h-5 w-5" />,
  'Jardin': <Trees className="h-5 w-5" />,
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const data = await propertyService.getAll();
        const foundProperty = data.find((p) => p.id === Number(id));
        if (foundProperty) {
          setProperty(foundProperty);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
        // Fallback: charger depuis le fichier local si le service de propriétés est indisponible
        fetch('/data/properties.json')
          .then((response) => response.json())
          .then((data: Property[]) => {
            const foundProperty = data.find((p) => p.id === Number(id));
            if (foundProperty) {
              setProperty(foundProperty);
            } else {
              navigate('/');
            }
          })
          .catch((err) => {
            console.error('Erreur chargement fallback:', err);
            navigate('/');
          });
      }
    };

    loadProperty();
  }, [id, navigate]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleBooking = () => {
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Retour aux propriétés</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-96 bg-gray-200">
            <img
              src={property.images[currentImageIndex]}
              alt={property.titre}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openLightbox(currentImageIndex)}
            />
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % property.images.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-4 bg-gray-50">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? 'border-blue-600 scale-105'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${property.titre} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {property.type}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {property.titre}
                </h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-1 text-blue-600" />
                  <span className="text-lg">{property.localisation}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-right">
                  <p className="text-sm text-gray-500">À partir de</p>
                  <p className="text-4xl font-bold text-blue-600">{property.prix}€</p>
                  <p className="text-sm text-gray-500">par nuit</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <Bed className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{property.caracteristiques.chambres}</p>
                  <p className="text-sm text-gray-500">Chambres</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <Bath className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{property.caracteristiques.sallesDeBain}</p>
                  <p className="text-sm text-gray-500">Salles de bain</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <Square className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{property.caracteristiques.superficie}</p>
                  <p className="text-sm text-gray-500">m²</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <HomeIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{property.caracteristiques.equipements.length}</p>
                  <p className="text-sm text-gray-500">Équipements</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Équipements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.caracteristiques.equipements.map((equipement, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-blue-600">
                      {equipmentIcons[equipement] || <Check className="h-5 w-5" />}
                    </div>
                    <span className="text-gray-700 font-medium">{equipement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                type="button"
                onClick={handleBooking}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-bold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Réserver maintenant
              </button>
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="w-full sm:w-auto px-8 py-4 border-2 border-blue-600 text-blue-700 bg-white text-lg font-bold rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="h-5 w-5" />
                Contacter l&apos;agent particulier
              </button>
            </div>
          </div>
        </div>
      </div>

      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          <button
            onClick={prevLightboxImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>
          <button
            onClick={nextLightboxImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="h-12 w-12" />
          </button>
          <img
            src={property.images[lightboxIndex]}
            alt={`${property.titre} ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
            {lightboxIndex + 1} / {property.images.length}
          </div>
        </div>
      )}

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        propertyTitle={property.titre}
        propertyPrice={property.prix}
        propertyId={property.id || 0}
        propertyType={property.type}
        bedrooms={property.caracteristiques.chambres}
      />

      <ContactAgentModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        propertyTitle={property.titre}
        propertyId={property.id || 0}
      />
      <ContactFab onOpen={() => setShowContactModal(true)} />
    </div>
  );
}
