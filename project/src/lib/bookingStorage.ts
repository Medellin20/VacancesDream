export interface StoredBooking {
  id: string;
  createdAt: string;
  propertyId: number;
  propertyTitle: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  totalPrice: number;
  accompteAmount: number;
  cautionAmount: number;
  amountPaid: number;
  paymentStatus: 'paid';
  checkoutSessionId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
}

const STORAGE_KEY = 'vacancesdream_bookings';

function parseBookings(raw: string | null): StoredBooking[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as any[]).map((b) => ({
      ...b,
      accompteAmount: typeof b.accompteAmount === 'number' ? b.accompteAmount : 0,
      cautionAmount: typeof b.cautionAmount === 'number' ? b.cautionAmount : 0,
      amountPaid: typeof b.amountPaid === 'number' ? b.amountPaid : 0,
      paymentStatus: b.paymentStatus === 'paid' ? 'paid' : 'paid',
      checkoutSessionId: typeof b.checkoutSessionId === 'string' ? b.checkoutSessionId : '',
      guestName: typeof b.guestName === 'string' ? b.guestName : '',
      guestEmail: typeof b.guestEmail === 'string' ? b.guestEmail : '',
      guestPhone: typeof b.guestPhone === 'string' ? b.guestPhone : '',
    })) as StoredBooking[];
  } catch {
    return [];
  }
}

export function getBookings(): StoredBooking[] {
  if (typeof window === 'undefined') return [];
  const list = parseBookings(localStorage.getItem(STORAGE_KEY));
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addBooking(
  data: Omit<StoredBooking, 'id' | 'createdAt'>
): StoredBooking {
  const entry: StoredBooking = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  if (typeof window === 'undefined') return entry;
  const existing = parseBookings(localStorage.getItem(STORAGE_KEY));
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]));
  return entry;
}
