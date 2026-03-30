import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Users, DollarSign } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyPrice: number;
  propertyId: number;
  propertyType: string;
  bedrooms: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  propertyTitle,
  propertyPrice,
  propertyId,
  propertyType,
  bedrooms,
}: BookingModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'dates' | 'payment'>('dates');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState('');

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(nights, 0);
  };

  const nights = calculateNights();
  const totalPrice = nights * propertyPrice;

  const isApartment = propertyType.toLowerCase().includes('appart');
  const accompteAmount = Math.round(totalPrice * (isApartment ? 0.3 : 0.25));
  const cautionBase = isApartment ? 500 : 800;
  const cautionPerExtraBedroom = isApartment ? 100 : 150;
  const cautionAmount =
    cautionBase + cautionPerExtraBedroom * Math.max(0, bedrooms - 1);

  const handleNext = () => {
    if (!checkInDate || !checkOutDate || nights < 1) {
      setError('Veuillez sélectionner des dates valides avec au moins 1 nuit');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handleClose = () => {
    setStep('dates');
    setCheckInDate('');
    setCheckOutDate('');
    setGuests(1);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8 my-8 animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-gray-900">Réserver</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <p className="text-gray-700">
            <span className="font-semibold">{propertyTitle}</span>
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{propertyPrice}€ par nuit</p>
        </div>

        {step === 'dates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date d'arrivée</span>
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => {
                    setCheckInDate(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date de départ</span>
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => {
                    setCheckOutDate(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Nombre de voyageurs</span>
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'voyageur' : 'voyageurs'}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {nights > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>{propertyPrice}€ × {nights} nuit{nights > 1 ? 's' : ''}</span>
                    <span className="font-semibold">{nights * propertyPrice}€</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-blue-600">{totalPrice}€</span>
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105"
            >
              Continuer
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Un agent immobilier vous contactera pour finaliser votre réservation et vous mettre en relation avec le propriétaire.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Durée du séjour</span>
                  <span className="font-semibold">{nights} nuit{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Nombre de voyageurs</span>
                  <span className="font-semibold">{guests}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tarif par nuit</span>
                  <span className="font-semibold">{propertyPrice}€</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Total estimé</span>
                  <span className="font-bold text-blue-600">{totalPrice}€</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Acompte (carte)</span>
                  <span className="font-bold text-blue-600">{accompteAmount}€</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Caution (ultérieurement)</span>
                  <span className="font-bold text-blue-600">{cautionAmount}€</span>
                </div>
                <p className="text-sm text-gray-500 pt-1">
                  La caution sera à verser ultérieurement selon les consignes de l&apos;agent.
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep('dates');
                  setError('');
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={() => {
                  try {
                    const draft = {
                      propertyId,
                      propertyTitle,
                      propertyPrice,
                      propertyType,
                      bedrooms,
                      checkInDate,
                      checkOutDate,
                      nights,
                      guests,
                      totalPrice,
                      accompteAmount,
                      cautionAmount,
                    };
                    localStorage.setItem('vacancesdream_payment_draft', JSON.stringify(draft));
                    onClose();
                    navigate('/paiement');
                  } catch {
                    setError('Impossible de préparer le paiement. Veuillez réessayer.');
                  }
                }}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105 disabled:opacity-75 flex items-center justify-center gap-2"
              >
                <>
                  <DollarSign className="h-5 w-5" />
                  <span>Payer l&apos;acompte par carte</span>
                </>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
