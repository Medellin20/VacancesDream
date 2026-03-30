import { MessageCircle } from 'lucide-react';

interface ContactFabProps {
  onOpen: () => void;
}

export default function ContactFab({ onOpen }: ContactFabProps) {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <button
        type="button"
        onClick={onOpen}
        className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-110 duration-200"
        title="Contacter l'agent"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
