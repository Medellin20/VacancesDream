import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CalendarDays, MapPin, Users, Mail, User, Phone, History, DollarSign, Shield } from 'lucide-react';
import { getBookings, type StoredBooking } from '../lib/bookingStorage';

export default function BookingHistory() {
  const [bookings, setBookings] = useState<StoredBooking[]>([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatStayDate = (value: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return formatDate(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
            <History className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historique des réservations</h1>
            <p className="text-gray-600 mt-1">
              Vos demandes enregistrées sur cet appareil (navigateur).
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-10 bg-white rounded-xl shadow-md p-10 text-center border border-gray-100">
            <History className="h-14 w-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-700 text-lg font-medium mb-2">Aucune réservation enregistrée</p>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Lorsque vous finalisez une demande depuis une fiche propriété, elle apparaîtra ici.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all"
            >
              Parcourir les propriétés
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-6">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <Link
                        to={`/property/${b.propertyId}`}
                        className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {b.propertyTitle}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="h-4 w-4 shrink-0" />
                        Demande du {formatDate(b.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Montant estimé</p>
                      <p className="text-2xl font-bold text-blue-600">{b.totalPrice} €</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 border-t border-gray-100 pt-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Arrivée</p>
                        <p>{formatStayDate(b.checkInDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarDays className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Départ</p>
                        <p>{formatStayDate(b.checkOutDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Voyageurs</p>
                        <p>
                          {b.guests} — {b.nights} nuit{b.nights > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Acompte payé</p>
                        <p>
                          {b.amountPaid} €
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Caution</p>
                        <p>
                          {b.cautionAmount} €
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Contact</p>
                        <p>{b.guestName}</p>
                        <p className="flex items-center gap-1 mt-0.5">
                          <Mail className="h-3.5 w-3.5" />
                          {b.guestEmail}
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {b.guestPhone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to={`/property/${b.propertyId}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Voir la propriété →
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
