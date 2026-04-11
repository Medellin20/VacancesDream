import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Mail, Phone, User } from 'lucide-react';
import { addBooking } from '../lib/bookingStorage';

type PaymentDraft = {
  propertyId: number;
  propertyTitle: string;
  propertyPrice: number;
  propertyType: string;
  bedrooms: number;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  totalPrice: number;
  accompteAmount: number;
  cautionAmount: number;
};

export default function PaymentDeposit() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<PaymentDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const cardBrand = useMemo(() => {
    const digits = cardNumber.replace(/\s+/g, '');
    if (/^4/.test(digits)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
    return 'unknown';
  }, [cardNumber]);

  const maskedCardNumber = useMemo(() => {
    if (!cardNumber) return '**** **** **** ****';
    const filled = cardNumber.padEnd(19, '*');
    return filled.replace(/[^0-9*\s]/g, '');
  }, [cardNumber]);

  useEffect(() => {
    const raw = localStorage.getItem('vacancesdream_payment_draft');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as PaymentDraft;
      setDraft(parsed);
    } catch {
      // ignore
    }
  }, []);

  const montantTotal = useMemo(() => {
    if (!draft) return 0;
    return draft.totalPrice;
  }, [draft]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedCardName = cardName.trim();
    const normalizedCardNumber = cardNumber.replace(/\s+/g, '');
    const normalizedExpiry = cardExpiry.trim();
    const normalizedCvc = cardCvc.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedCardName || !normalizedCardNumber || !normalizedExpiry || !normalizedCvc) {
      setError('Veuillez remplir tous les champs de contact et de carte');
      return;
    }

    if (!trimmedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (!/^\d{16}$/.test(normalizedCardNumber)) {
      setError('Le numéro de carte doit contenir 16 chiffres');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(normalizedExpiry)) {
      setError('La date d’expiration doit être au format MM/AA');
      return;
    }

    if (!/^\d{3,4}$/.test(normalizedCvc)) {
      setError('Le code CVC doit contenir 3 ou 4 chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        propertyId: draft.propertyId,
        propertyTitle: draft.propertyTitle,
        propertyPrice: draft.propertyPrice,
        propertyType: draft.propertyType,
        checkInDate: draft.checkInDate,
        checkOutDate: draft.checkOutDate,
        nights: draft.nights,
        guests: draft.guests,
        totalPrice: draft.totalPrice,
        accompteAmount: draft.accompteAmount,
        cautionAmount: draft.cautionAmount,
        guestName: trimmedName,
        guestEmail: trimmedEmail,
        guestPhone: trimmedPhone,
      };

      const apiEndpoint = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api/send-booking`
        : '/api/send-booking';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.error || 'Impossible d\'envoyer l\'email de réservation.';
        throw new Error(message);
      }

      const booking = addBooking({
        ...payload,
        amountPaid: draft.accompteAmount,
        paymentStatus: 'paid',
        checkoutSessionId: `local-${crypto.randomUUID()}`,
      });

      localStorage.removeItem('vacancesdream_payment_draft');
      navigate(`/paiement/success?bookingId=${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!draft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-10 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Paiement indisponible</h1>
          <p className="text-gray-700 mb-6">
            Il manque les informations de la réservation. Revenez à une fiche propriété puis recommencez.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all"
          >
            Parcourir les propriétés
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paiement de l&apos;acompte</h1>
          <p className="text-gray-600 mb-6">Finalisez votre réservation en payant l&apos;acompte par carte.</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
            <div className="text-sm text-blue-800 mb-2">
              {draft.propertyTitle}
            </div>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Total estimé</span>
                <span className="font-semibold">{montantTotal}€</span>
              </div>
              <div className="flex justify-between">
                <span>Acompte (carte)</span>
                <span className="font-semibold text-blue-700">{draft.accompteAmount}€</span>
              </div>
              <div className="flex justify-between">
                <span>Caution (ultérieurement)</span>
                <span className="font-semibold">{draft.cautionAmount}€</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="jean@exemple.fr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div className="border-t border-gray-100 pt-5 mt-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Coordonnées carte</h2>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-12 rounded-md border flex items-center justify-center text-[10px] font-bold ${
                      cardBrand === 'visa'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                    title="Visa"
                  >
                    VISA
                  </div>
                  <div
                    className={`h-8 w-12 rounded-md border flex items-center justify-center text-[9px] font-bold ${
                      cardBrand === 'mastercard'
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                    title="Mastercard"
                  >
                    MC
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white p-5 shadow-lg mb-4">
                <div className="text-xs uppercase tracking-wide text-blue-100">Carte bancaire</div>
                <div className="mt-4 text-xl font-semibold tracking-widest">{maskedCardNumber}</div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-[11px] text-blue-100">Titulaire</div>
                    <div className="font-medium uppercase">{cardName || 'NOM PRENOM'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-blue-100">Expire</div>
                    <div className="font-medium">{cardExpiry || 'MM/AA'}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom sur la carte
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value.toUpperCase());
                      setError('');
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
                      setCardNumber(formatted);
                      setError('');
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration (MM/AA)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardExpiry}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                        const formatted =
                          digits.length > 2
                            ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                            : digits;
                        setCardExpiry(formatted);
                        setError('');
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="12/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardCvc}
                      onChange={(e) => {
                        setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4));
                        setError('');
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-[1.01] disabled:opacity-75 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Préparation paiement...</span>
                </>
              ) : (
                <span>Payer l&apos;acompte par carte</span>
              )}
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  navigate(-1);
                }}
                className="w-full py-3 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Retour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

