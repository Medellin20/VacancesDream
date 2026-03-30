import { Home, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">VacancesDream</span>
            </div>
            <p className="text-sm leading-relaxed">
              Trouvez la location de vacances parfaite pour vos prochaines escapades. Des villas luxueuses aux appartements cosy.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Liens Utiles</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                  Conditions générales
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>123 Avenue des Vacances, 75001 Paris</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>contact@vacancesdream.fr</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors transform hover:scale-110 duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-colors transform hover:scale-110 duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition-colors transform hover:scale-110 duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm mt-4 leading-relaxed">
              Restez informé de nos dernières offres et nouveautés
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} VacancesDream. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
