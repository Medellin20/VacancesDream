import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader } from 'lucide-react';
import { getBookings, type StoredBooking } from '../lib/bookingStorage';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBookingState] = useState<StoredBooking | null>(null);

  useEffect(() => {
    const booking = bookingId ? getBookings().find((b) => b.id === bookingId) : null;

    if (!booking) {
      setError('Réservation introuvable.');
      setLoading(false);
      return;
    }

    setBookingState(booking);
    setLoading(false);
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-10 flex items-center gap-4">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <p className="text-gray-700 font-medium">Confirmation en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-10 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Paiement non confirmé</h2>
          <p className="text-gray-700">{error}</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all"
            >
              Retour aux propriétés
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paiement confirmé</h1>
              <p className="text-gray-600 mt-2">
                Nous avons bien reçu votre paiement et envoyé les informations à l&apos;agent.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h2>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Propriété</span>
                <span className="font-semibold text-right">{booking.propertyTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Arrivée</span>
                <span className="font-semibold text-right">
                  {new Date(booking.checkInDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Départ</span>
                <span className="font-semibold text-right">
                  {new Date(booking.checkOutDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Acompte (carte)</span>
                <span className="font-semibold text-right text-blue-600">{booking.amountPaid}€</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Caution</span>
                <span className="font-semibold text-right">{booking.cautionAmount}€</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/mes-reservations"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Voir mes réservations
              </Link>
              <Link
                to={`/property/${booking.propertyId}`}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all"
              >
                Retour à la propriété
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

