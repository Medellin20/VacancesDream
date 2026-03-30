import { MessageCircle, X } from 'lucide-react';

interface ContactAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId: number;
}

export default function ContactAgentModal({
  isOpen,
  onClose,
  propertyTitle,
  propertyId,
}: ContactAgentModalProps) {
  const agentPhone = '+33612345678';
  const agentWhatsApp = '+33612345678';

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé par la propriété "${propertyTitle}" (ID: ${propertyId}). Je voudrais discuter des détails et en savoir plus.`
    );
    window.open(`https://wa.me/${agentWhatsApp.replace(/\D/g, '')}?text=${message}`, '_blank');
    onClose();
  };

  const handleSMS = () => {
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé par la propriété "${propertyTitle}". Je voudrais discuter des détails et en savoir plus.`
    );
    window.open(`sms:${agentPhone}?body=${message}`, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-slideUp relative"
        role="dialog"
        aria-labelledby="contact-agent-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fermer"
        >
          <X className="h-6 w-6" />
        </button>
        <h3 id="contact-agent-title" className="font-bold text-gray-900 text-lg pr-10 mb-1">
          Contacter l&apos;agent particulier
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Pour « {propertyTitle} » — choisissez votre moyen de contact.
        </p>
        <div className="space-y-2 flex flex-col">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.335 1.236-3.356 2.192C3.75 10.645 3 12.3 3 14.012c0 1.59.432 3.163 1.239 4.555L3 21l4.772-1.25c1.463.742 3.12 1.112 4.772 1.112 5.487 0 9.905-4.368 9.905-9.773 0-2.633-.997-5.109-2.812-6.982C19.478 3.75 17.173 2.75 14.551 2.75z" />
            </svg>
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleSMS}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <MessageCircle className="h-5 w-5 shrink-0" />
            <span>SMS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
