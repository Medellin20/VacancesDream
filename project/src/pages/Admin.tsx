import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Plus, CreditCard as Edit, Trash2, Save, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface Property {
  id: number;
  titre: string;
  type: string;
  localisation: string;
  prix: number;
  description: string;
  caracteristiques: {
    chambres: number;
    sallesDeBain: number;
    superficie: number;
    equipements: string[];
  };
  images: string[];
}

const ADMIN_PASSWORD = 'admin123';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Property | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadProperties();
    }
  }, [isAuthenticated]);

  const loadProperties = () => {
    fetch('/data/properties.json')
      .then((response) => response.json())
      .then((data) => setProperties(data))
      .catch((error) => console.error('Erreur chargement données:', error));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleEdit = (property: Property) => {
    setEditingId(property.id);
    setEditForm({ ...property });
  };

  const handleSave = () => {
    if (editForm) {
      setProperties(properties.map(p => p.id === editForm.id ? editForm : p));
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleAddNew = () => {
    const newProperty: Property = {
      id: Math.max(...properties.map(p => p.id)) + 1,
      titre: '',
      type: 'Maison',
      localisation: '',
      prix: 0,
      description: '',
      caracteristiques: {
        chambres: 1,
        sallesDeBain: 1,
        superficie: 50,
        equipements: [],
      },
      images: [],
    };
    setEditForm(newProperty);
    setShowAddForm(true);
  };

  const handleSaveNew = () => {
    if (editForm && editForm.titre && editForm.localisation && editForm.images.length > 0) {
      setProperties([...properties, editForm]);
      setShowAddForm(false);
      setEditForm(null);
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(properties, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'properties.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Espace Admin</h2>
              <p className="text-gray-600">Connectez-vous pour gérer les propriétés</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Entrez le mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105"
              >
                Se connecter
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Mot de passe:</strong> admin123
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des propriétés</h1>
              <p className="text-gray-600">Ajoutez, modifiez ou supprimez des propriétés</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Ajouter</span>
              </button>
              <button
                onClick={downloadJSON}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-5 w-5" />
                <span>Télécharger JSON</span>
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Mode simulation - Données locales</p>
                <p>Les modifications ne sont pas persistantes. Pour sauvegarder vos changements, téléchargez le fichier JSON et remplacez manuellement le fichier dans <code className="bg-yellow-100 px-1 rounded">/public/data/properties.json</code></p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {editingId === property.id && editForm ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                      <input
                        type="text"
                        value={editForm.titre}
                        onChange={(e) => setEditForm({ ...editForm, titre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option>Maison</option>
                        <option>Appartement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                      <input
                        type="text"
                        value={editForm.localisation}
                        onChange={(e) => setEditForm({ ...editForm, localisation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€/nuit)</label>
                      <input
                        type="number"
                        value={editForm.prix}
                        onChange={(e) => setEditForm({ ...editForm, prix: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
                      <input
                        type="number"
                        value={editForm.caracteristiques.chambres}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          caracteristiques: { ...editForm.caracteristiques, chambres: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salles de bain</label>
                      <input
                        type="number"
                        value={editForm.caracteristiques.sallesDeBain}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          caracteristiques: { ...editForm.caracteristiques, sallesDeBain: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
                      <input
                        type="number"
                        value={editForm.caracteristiques.superficie}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          caracteristiques: { ...editForm.caracteristiques, superficie: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditForm(null);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img
                      src={property.images[0]}
                      alt={property.titre}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{property.titre}</h3>
                        <p className="text-gray-600">{property.localisation}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(property)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">Type:</span>
                        <p className="font-medium">{property.type}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">Prix:</span>
                        <p className="font-medium">{property.prix}€/nuit</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">Chambres:</span>
                        <p className="font-medium">{property.caracteristiques.chambres}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">Photos:</span>
                        <p className="font-medium">{property.images.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {showAddForm && editForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full p-8 my-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Ajouter une propriété</h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditForm(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      type="text"
                      value={editForm.titre}
                      onChange={(e) => setEditForm({ ...editForm, titre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ex: Villa Moderne avec Vue Mer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>Maison</option>
                      <option>Appartement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                    <input
                      type="text"
                      value={editForm.localisation}
                      onChange={(e) => setEditForm({ ...editForm, localisation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ex: Nice, Côte d'Azur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€/nuit)</label>
                    <input
                      type="number"
                      value={editForm.prix}
                      onChange={(e) => setEditForm({ ...editForm, prix: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Décrivez la propriété en détail..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
                    <input
                      type="number"
                      value={editForm.caracteristiques.chambres}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        caracteristiques: { ...editForm.caracteristiques, chambres: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salles de bain</label>
                    <input
                      type="number"
                      value={editForm.caracteristiques.sallesDeBain}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        caracteristiques: { ...editForm.caracteristiques, sallesDeBain: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
                    <input
                      type="number"
                      value={editForm.caracteristiques.superficie}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        caracteristiques: { ...editForm.caracteristiques, superficie: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ImageIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Instructions pour les images</p>
                      <p>Ajoutez manuellement au moins 12 images dans le fichier JSON téléchargé. Vous pouvez utiliser des URLs d'images Pexels ou stocker les images localement dans <code className="bg-blue-100 px-1 rounded">/public/properties/nom-du-bien/</code></p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveNew}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Créer la propriété
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditForm(null);
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
