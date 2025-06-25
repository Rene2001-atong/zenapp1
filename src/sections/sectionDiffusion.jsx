  import React, { useState, useEffect, useMemo } from 'react';
  import { appId, firebaseConfig} from '../firebase/config';
  import { initializeApp } from 'firebase/app';
  import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
  import { getFirestore, 
        collection, 
        addDoc, 
        doc, 
        updateDoc, 
        deleteDoc, 
        onSnapshot
      } from 'firebase/firestore';
      
  // Initialisation de Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);


//   composants modaux
// composants ui ux
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

  const Modal = ({ isOpen, onClose, title, children, size = "lg" }) => {
    if (!isOpen) return null;
    const maxWidthClass = { "lg": "max-w-lg", "xl": "max-w-xl", "2xl": "max-w-2xl" }[size];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className={`bg-white p-6 rounded-xl shadow-2xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-slate-700">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="overflow-y-auto flex-grow pr-2">{children}</div>
            </div>
        </div>
    );
};
const InputField = ({ label, id, error, type = "text", ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={id} type={type} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const TextareaField = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={id} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const SelectField = ({ label, id, error, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select id={id} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}>
            {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

  
  const DiffusionForm = ({ initialDiffusion, onSave, onCancel, clientsData }) => {
      const defaultState = {
          titre: '',
          categorie: 'Spot Publicitaire', // Default category
          prix: 0,
          clientId: '',
          responsableDiffusion: '',
          periodicite: 'Unique', // Unique, Par Jour, Par Mois
          nombreDiffusion: 1,
          descriptionAbonnement: '',
          dateDebutDiffusion: new Date().toISOString().split('T')[0],
          dateFinDiffusion: '',
      };
      const [diffusion, setDiffusion] = useState(defaultState);
      const [errors, setErrors] = useState({});
  
      const categoriesDiffusion = ['Spot Publicitaire', 'Avis de Décès', 'Intérêt Général', 'Émission'];
      const periodiciteOptions = ['Unique', 'Par Jour', 'Par Mois', 'Campagne'];
      useEffect(() => {
          if (initialDiffusion) {
              setDiffusion({
                  ...initialDiffusion,
                  prix: initialDiffusion.prix || 0,
                  nombreDiffusion: initialDiffusion.nombreDiffusion || 1,
                  dateDebutDiffusion: initialDiffusion.dateDebutDiffusion?.seconds ? new Date(initialDiffusion.dateDebutDiffusion.seconds * 1000).toISOString().split('T')[0] : (initialDiffusion.dateDebutDiffusion ? new Date(initialDiffusion.dateDebutDiffusion).toISOString().split('T')[0] : defaultState.dateDebutDiffusion),
                  dateFinDiffusion: initialDiffusion.dateFinDiffusion?.seconds ? new Date(initialDiffusion.dateFinDiffusion.seconds * 1000).toISOString().split('T')[0] : (initialDiffusion.dateFinDiffusion ? new Date(initialDiffusion.dateFinDiffusion).toISOString().split('T')[0] : defaultState.dateFinDiffusion),
              });
          } else {
              setDiffusion(defaultState);
          }
          setErrors({});
      }, [initialDiffusion]);
  
      const handleChange = (e) => {
          const { name, value, type } = e.target;
          const val = type === 'number' ? parseFloat(value) : value;
          setDiffusion(prev => ({ ...prev, [name]: val }));
          if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
      };
  
      const validate = () => {
          const newErrors = {};
          if (!diffusion.titre.trim()) newErrors.titre = "Le titre est requis.";
          if (!diffusion.categorie) newErrors.categorie = "La catégorie est requise.";
          if (isNaN(diffusion.prix) || diffusion.prix < 0) newErrors.prix = "Le prix doit être un nombre positif ou zéro.";
          if (isNaN(diffusion.nombreDiffusion) || diffusion.nombreDiffusion <= 0) newErrors.nombreDiffusion = "Le nombre de diffusions doit être positif.";
          if (!diffusion.dateDebutDiffusion) newErrors.dateDebutDiffusion = "La date de début est requise.";
          if (diffusion.dateFinDiffusion && new Date(diffusion.dateFinDiffusion) < new Date(diffusion.dateDebutDiffusion)) {
              newErrors.dateFinDiffusion = "La date de fin ne peut pas être antérieure à la date de début.";
          }
  
          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
      };
  
      const handleSubmit = (e) => {
          e.preventDefault();
          if (validate()) {
              const dataToSave = {
                  ...diffusion,
                  dateDebutDiffusion: diffusion.dateDebutDiffusion ? new Date(diffusion.dateDebutDiffusion) : null,
dateFinDiffusion: diffusion.dateFinDiffusion ? new Date(diffusion.dateFinDiffusion) : null,
            };
            onSave(dataToSave);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Titre" id="titre" name="titre" value={diffusion.titre} onChange={handleChange} error={errors.titre} required />
            <SelectField label="Catégorie" id="categorie" name="categorie" value={diffusion.categorie} onChange={handleChange} error={errors.categorie} required>
                {categoriesDiffusion.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </SelectField>
            <InputField label="Prix (€)" id="prix" name="prix" type="number" value={diffusion.prix} onChange={handleChange} error={errors.prix} min="0" step="0.01" />
              <SelectField label="Client" id="clientId" name="clientId" value={diffusion.clientId} onChange={handleChange} error={errors.clientId}>
                  <option value="">Sélectionner un client (si applicable)</option>
                  {Array.isArray(clientsData) && clientsData.map(client => <option key={client.id} value={client.id}>{client.nom} {client.prenom}</option>)}
              </SelectField>
              <InputField label="Responsable de Diffusion" id="responsableDiffusion" name="responsableDiffusion" value={diffusion.responsableDiffusion} onChange={handleChange} />
              <SelectField label="Périodicité" id="periodicite" name="periodicite" value={diffusion.periodicite} onChange={handleChange}>
                  {periodiciteOptions.map(per => <option key={per} value={per}>{per}</option>)}
              </SelectField>
              <InputField label="Nombre de Diffusion(s)" id="nombreDiffusion" name="nombreDiffusion" type="number" value={diffusion.nombreDiffusion} onChange={handleChange} error={errors.nombreDiffusion} min="1" />
              <InputField label="Date de Début Diffusion" id="dateDebutDiffusion" name="dateDebutDiffusion" type="date" value={diffusion.dateDebutDiffusion} onChange={handleChange} error={errors.dateDebutDiffusion} required />
              <InputField label="Date de Fin Diffusion (optionnel)" id="dateFinDiffusion" name="dateFinDiffusion" type="date" value={diffusion.dateFinDiffusion} onChange={handleChange} error={errors.dateFinDiffusion} />
              <TextareaField label="Description de l'Abonnement/Plan" id="descriptionAbonnement" name="descriptionAbonnement" value={diffusion.descriptionAbonnement} onChange={handleChange} rows="3" />
  
              <div className="flex justify-end space-x-3 pt-3 border-t">
                  <button type="button" onClick={onCancel} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-md text-sm font-medium">Annuler</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"><SaveIcon /> {diffusion.id ? 'Mettre à jour' : 'Enregistrer'}</button>
              </div>
          </form>
);
};

export default function SectionGestionDiffusions ({ currentUserId, clientsData }) {
    const [diffusions, setDiffusions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDiffusion, setCurrentDiffusion] = useState(null);
    const [error, setError] = useState(null);

    const diffusionsCollectionPath = useMemo(() => {
        if (!currentUserId) return null;
        return `artifacts/${appId}/users/${currentUserId}/diffusions`;
    }, [currentUserId]);

    useEffect(() => {
        if (!diffusionsCollectionPath) {
            setIsLoading(false);
            setDiffusions([]);
            return () => {};
        }
        setIsLoading(true);
        const unsubscribe = onSnapshot(collection(db, diffusionsCollectionPath),
            (snapshot) => {
                setDiffusions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setIsLoading(false);
            },
            (err) => {
                console.error("Erreur lecture diffusions:", err);
                setError("Impossible de charger les diffusions.");
                setIsLoading(false);
            }
        );
        return () => unsubscribe();
    }, [diffusionsCollectionPath]);

    const handleSaveDiffusion = async (diffusionData) => {
        if (!diffusionsCollectionPath) {
            setError("Chemin de collection non défini.");
            return;
        }
        try {
            if (diffusionData.id) {
                const { id, ...dataToUpdate } = diffusionData;
                await updateDoc(doc(db, diffusionsCollectionPath, id), dataToUpdate);
            } else {
                await addDoc(collection(db, diffusionsCollectionPath), diffusionData);
            }
            setIsModalOpen(false);
            setCurrentDiffusion(null);
        } catch (err) {
            console.error("Erreur sauvegarde diffusion:", err);
            setError("Échec de la sauvegarde de la diffusion.");
        }
    };

    const handleDeleteDiffusion = async (diffusionId) => {
        if (!diffusionsCollectionPath) {
            setError("Chemin de collection non défini.");
            return;
        }
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette diffusion ?")) {
            try {
                await deleteDoc(doc(db, diffusionsCollectionPath, diffusionId));
            } catch (err) {
                console.error("Erreur suppression diffusion:", err);
                setError("Échec de la suppression de la diffusion.");
            }
        }
    };
    
    const getClientName = (clientId) => {
        if (!Array.isArray(clientsData)) return 'N/A';
        const client = clientsData.find(c => c.id === clientId);
        return client ? `${client.nom} ${client.prenom}` : 'N/A';
    };


    if (!currentUserId) return <div className="p-6 bg-white rounded-xl shadow-lg text-center text-slate-500">Veuillez vous connecter pour gérer les diffusions.</div>;

    return (
        <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg min-h-screen">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-slate-800">Gestion des Diffusions</h2>
                  <button onClick={() => { setCurrentDiffusion(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"><PlusIcon className="w-5 h-5 mr-2"/>Nouvelle Diffusion</button>
              </div>
              {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
              {isLoading ? <div className="text-center py-8"><ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin inline"/> Chargement...</div> : (
                  <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200">
                          <thead className="bg-slate-100">
                              <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Titre</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Catégorie</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
                                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Prix</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
{diffusions.map(diff => (
                                <tr key={diff.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{diff.titre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{diff.categorie}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getClientName(diff.clientId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{parseFloat(diff.prix || 0).toFixed(2)} €</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <button onClick={() => { setCurrentDiffusion(diff); setIsModalOpen(true); }} className="text-yellow-600 hover:text-yellow-800 p-1"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteDiffusion(diff.id)} className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                              ))}
                              {diffusions.length === 0 && <tr><td colSpan="5" className="text-center py-6 text-slate-500">Aucune diffusion enregistrée.</td></tr>}
                          </tbody>
                      </table>
                  </div>
              )}
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentDiffusion ? "Modifier Diffusion" : "Ajouter Diffusion"} size="xl">
                  <DiffusionForm initialDiffusion={currentDiffusion} onSave={handleSaveDiffusion} onCancel={() => setIsModalOpen(false)} clientsData={clientsData} currentUserId={currentUserId} />
              </Modal>
          </div>
      );
};