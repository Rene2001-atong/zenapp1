  import React, { useState, useEffect, useMemo } from 'react';
  import { initializeApp } from 'firebase/app';
  import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
  import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
  import { firebaseConfig } from './firebase/config';
  import { ArrowPathIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, PrinterIcon, XMarkIcon, MagnifyingGlassIcon, BanknotesIcon, DocumentChartBarIcon, UsersIcon, ChartPieIcon, CalendarDaysIcon, ListBulletIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" /></svg>;
  const CancelButton = ({ children, onClick }) => (
<button type="button" onClick={onClick} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
        {children}
    </button>
);

const InputField = ({ label, id, error, type = "text", ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={id} type={type} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'} transition-shadow`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const SelectField = ({ label, id, error, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select id={id} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'} transition-shadow`}>
            {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const TextareaField = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={id} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'} transition-shadow`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const Modal = ({ isOpen, onClose, title, children, size = "2xl" }) => {
    if (!isOpen) return null;
    const maxWidthClass = { "sm": "max-w-sm", "md": "max-w-md", "lg": "max-w-lg", "xl": "max-w-xl", "2xl": "max-w-2xl", "3xl": "max-w-3xl", "4xl": "max-w-4xl", "5xl": "max-w-5xl" }[size];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out">
            <div className={`bg-white p-6 rounded-xl shadow-2xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-slate-700">{title}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"><XMarkIcon className="w-7 h-7" /></button>
                </div>
                <div className="overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">{children}</div>
            </div>
            <style jsx global>{`@keyframes modalShow { to { opacity: 1; transform: scale(1); } } .animate-modalShow { animation: modalShow 0.3s forwards; }`}</style>
          </div>
      );
  };
  
  
  const ClientForm = ({ initialClient, onSave, onCancel }) => {
      const [client, setClient] = useState({ nom: '', prenom: '', tel: '', email: '', adresse: '', notes: '' });
const [errors, setErrors] = useState({});

    useEffect(() => {
        setClient(initialClient ? initialClient : { nom: '', prenom: '', tel: '', email: '', adresse: '', notes: '' });
        setErrors({});
    }, [initialClient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!client.nom.trim()) newErrors.nom = "Le nom est requis.";
        if (!client.prenom.trim()) newErrors.prenom = "Le prénom est requis.";
        if (!client.tel.trim()) newErrors.tel = "Le téléphone est requis.";
        if (client.email.trim() && !/\S+@\S+\.\S+/.test(client.email)) newErrors.email = "Format d'email invalide.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) onSave(client);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Nom" id="nom" name="nom" value={client.nom} onChange={handleChange} error={errors.nom} required />
            <InputField label="Prénom" id="prenom" name="prenom" value={client.prenom} onChange={handleChange} error={errors.prenom} required />
            <InputField label="Téléphone" id="tel" name="tel" type="tel" value={client.tel} onChange={handleChange} error={errors.tel} required />
            <InputField label="Email" id="email" name="email" type="email" value={client.email} onChange={handleChange} error={errors.email} />
            <TextareaField label="Adresse" id="adresse" name="adresse" value={client.adresse} onChange={handleChange} rows="2" />
            <TextareaField label="Notes" id="notes" name="notes" value={client.notes} onChange={handleChange} rows="3" />
            <div className="flex justify-end space-x-3 pt-3 border-t">
                <CancelButton onClick={onCancel}>Annuler</CancelButton>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"><SaveIcon /> {client.id ? 'Mettre à jour' : 'Enregistrer'}</button>
            </div>
        </form>
    );
  };
  
  const SectionGestionClients = ({ currentUserId }) => {
      const [clients, setClients] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [error, setError] = useState(null);
    
    const clientsCollectionPath = useMemo(() => {
        if (!currentUserId) return null;
        return `artifacts/${appId}/users/${currentUserId}/clients`;
    }, [currentUserId]);

    useEffect(() => {
        if (!clientsCollectionPath) { setIsLoading(false); setClients([]); return () => {}; }
        setIsLoading(true);
        const unsubscribe = onSnapshot(collection(db, clientsCollectionPath), 
            (snapshot) => { setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); setIsLoading(false); }, 
            (err) => { console.error("Erreur lecture clients:", err); setError("Impossible de charger les clients."); setIsLoading(false); }
        );
        return () => unsubscribe();
    }, [clientsCollectionPath]);

    const handleSaveClient = async (clientData) => {
        if (!clientsCollectionPath) { setError("Chemin de collection non défini."); return; }
        try {
            if (clientData.id) {
                const { id, ...dataToUpdate } = clientData;
                await updateDoc(doc(db, clientsCollectionPath, id), dataToUpdate);
            } else { await addDoc(collection(db, clientsCollectionPath), clientData); }
            setIsModalOpen(false); setCurrentClient(null);
        } catch (err) { console.error("Erreur sauvegarde client:", err); setError("Échec de la sauvegarde."); }
    };

    const handleDeleteClient = async (clientId) => {
        if (!clientsCollectionPath) { setError("Chemin de collection non défini."); return; }
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
            try { await deleteDoc(doc(db, clientsCollectionPath, clientId)); }
            catch (err) { console.error("Erreur suppression client:", err); setError("Échec de la suppression."); }
        }
    };

    if (!currentUserId) return <div className="p-6 bg-white rounded-xl shadow-lg text-center text-slate-500">Veuillez vous connecter pour gérer les clients.</div>;

    return (
        <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Gestion des Clients</h2>
                <button onClick={() => { setCurrentClient(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"><PlusIcon className="w-5 h-5 mr-2"/>Nouveau Client</button>
            </div>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
            {isLoading ? <div className="text-center py-8"><ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin inline"/> Chargement...</div> : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Prénom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Téléphone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{client.nom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{client.prenom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{client.tel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{client.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <button onClick={() => { setCurrentClient(client); setIsModalOpen(true); }} className="text-yellow-600 hover:text-yellow-800 p-1"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteClient(client.id)} className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                             {clients.length === 0 && <tr><td colSpan="5" className="text-center py-6 text-slate-500">Aucun client enregistré.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentClient ? "Modifier Client" : "Ajouter Client"} size="lg">
                <ClientForm initialClient={currentClient} onSave={handleSaveClient} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};
  const SectionGestionDiffusions = ({ currentUserId, clientsData }) => {
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
        if (!diffusionsCollectionPath) { setIsLoading(false); setDiffusions([]); return () => {}; }
        setIsLoading(true);
        const unsubscribe = onSnapshot(collection(db, diffusionsCollectionPath),
            (snapshot) => { setDiffusions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); setIsLoading(false); },
            (err) => { console.error("Erreur lecture diffusions:", err); setError("Impossible de charger les diffusions."); setIsLoading(false); }
        );
        return () => unsubscribe();
    }, [diffusionsCollectionPath]);

    const handleSaveDiffusion = async (diffusionData) => {
        if (!diffusionsCollectionPath) { setError("Chemin de collection non défini."); return; }
        try {
            const dataToSave = { ...diffusionData,
                dateDebutDiffusion: diffusionData.dateDebutDiffusion ? new Date(diffusionData.dateDebutDiffusion) : null,
                dateFinDiffusion: diffusionData.dateFinDiffusion ? new Date(diffusionData.dateFinDiffusion) : null,
            };
            if (dataToSave.id) {
                const { id, ...finalDataToUpdate } = dataToSave;
                await updateDoc(doc(db, diffusionsCollectionPath, id), finalDataToUpdate);
            } else { await addDoc(collection(db, diffusionsCollectionPath), dataToSave); }
            setIsModalOpen(false); setCurrentDiffusion(null);
        } catch (err) { console.error("Erreur sauvegarde diffusion:", err); setError("Échec de la sauvegarde: " + err.message); }
    };

    const handleDeleteDiffusion = async (diffusionId) => {
        if (!diffusionsCollectionPath) { setError("Chemin de collection non défini."); return; }
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette diffusion/campagne ?")) {
            try { await deleteDoc(doc(db, diffusionsCollectionPath, diffusionId)); }
            catch (err) { console.error("Erreur suppression diffusion:", err); setError("Échec de la suppression."); }
        }
    };
    
    const getClientName = (clientId) => {
        if (!Array.isArray(clientsData)) return 'N/A';
        const client = clientsData.find(c => c.id === clientId);
        return client ? `${client.nom} ${client.prenom}` : (clientId ? 'Client Spécifique' : 'Interne/Général');
    };

    if (!currentUserId) return <div className="p-6 bg-white rounded-xl shadow-lg text-center text-slate-500">Veuillez vous connecter pour gérer les diffusions.</div>;

    return (
        <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Gestion des Diffusions / Campagnes</h2>
                <button onClick={() => { setCurrentDiffusion(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"><PlusIcon className="w-5 h-5 mr-2"/>Nouvelle Diffusion/Campagne</button>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Période</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Créneaux/jour</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {diff.dateDebutDiffusion?.seconds ? new Date(diff.dateDebutDiffusion.seconds * 1000).toLocaleDateString('fr-CA') : (diff.dateDebutDiffusion ? new Date(diff.dateDebutDiffusion).toLocaleDateString('fr-CA') : 'N/A')}
                                        {' - '}
                                        {diff.dateFinDiffusion?.seconds ? new Date(diff.dateFinDiffusion.seconds * 1000).toLocaleDateString('fr-CA') : (diff.dateFinDiffusion ? new Date(diff.dateFinDiffusion).toLocaleDateString('fr-CA') : 'N/A')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-center">{diff.creneaux?.length || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{parseFloat(diff.prix || 0).toFixed(2)} €</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <button onClick={() => { setCurrentDiffusion(diff); setIsModalOpen(true); }} className="text-yellow-600 hover:text-yellow-800 p-1"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteDiffusion(diff.id)} className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                            {diffusions.length === 0 && <tr><td colSpan="7" className="text-center py-6 text-slate-500">Aucune diffusion/campagne enregistrée.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentDiffusion ? "Modifier Diffusion/Campagne" : "Ajouter Diffusion/Campagne"} size="2xl">
                <DiffusionForm initialDiffusion={currentDiffusion} onSave={handleSaveDiffusion} onCancel={() => setIsModalOpen(false)} clientsData={clientsData} currentUserId={currentUserId} />
            </Modal>
        </div>
    );
  };
  
  const CreneauForm = ({ creneau, index, onChange, onRemove, errors }) => {
      return (
          <div className={`grid grid-cols-1 sm:grid-cols-7 gap-3 items-end p-3 border ${errors ? 'border-red-200' : 'border-slate-200'} rounded-md mb-2`}>
              <div className="sm:col-span-2">
                  <InputField label={`Heure Créneau ${index + 1}`} type="time" value={creneau.heure} onChange={(e) => onChange(index, 'heure', e.target.value)} error={errors?.heure} required />
              </div>
              <div className="sm:col-span-3">
                  <InputField label="Responsable Créneau" value={creneau.responsable} onChange={(e) => onChange(index, 'responsable', e.target.value)} error={errors?.responsable} placeholder="Nom du responsable" />
              </div>
               <div className="sm:col-span-1">
                  <InputField label="Statut" type="text" value={creneau.statut || 'Programmé'} onChange={(e) => onChange(index, 'statut', e.target.value)} placeholder="Programmé" disabled />
              </div>
              <div className="sm:col-span-1">
                  <button type="button" onClick={() => onRemove(index)} className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center justify-center transition-colors">
                      <TrashIcon className="w-5 h-5"/>
                  </button>
              </div>
          </div>
      );
  };
  
  const DiffusionForm = ({ initialDiffusion, onSave, onCancel, clientsData }) => {
      const defaultState = {
          titre: '', categorie: 'Spot Publicitaire', prix: 0, clientId: '', descriptionAbonnement: '',
          dateDebutDiffusion: new Date().toISOString().split('T')[0], dateFinDiffusion: '', dureeElement: '',
          creneaux: [{ heure: '', responsable: '', statut: 'Programmé' }]
      };
      const [diffusion, setDiffusion] = useState(defaultState);
      const [errors, setErrors] = useState({});
      const categoriesDiffusion = ['Spot Publicitaire', 'Avis de Décès', 'Intérêt Général', 'Émission'];
  
      useEffect(() => {
          if (initialDiffusion) {
              setDiffusion({ ...defaultState, ...initialDiffusion,
                  prix: initialDiffusion.prix || 0,
                  creneaux: initialDiffusion.creneaux && initialDiffusion.creneaux.length > 0 ? initialDiffusion.creneaux : [{ heure: '', responsable: '', statut: 'Programmé' }],
                  dateDebutDiffusion: initialDiffusion.dateDebutDiffusion?.seconds ? new Date(initialDiffusion.dateDebutDiffusion.seconds * 1000).toISOString().split('T')[0] : (initialDiffusion.dateDebutDiffusion ? new Date(initialDiffusion.dateDebutDiffusion).toISOString().split('T')[0] : defaultState.dateDebutDiffusion),
                  dateFinDiffusion: initialDiffusion.dateFinDiffusion?.seconds ? new Date(initialDiffusion.dateFinDiffusion.seconds * 1000).toISOString().split('T')[0] : (initialDiffusion.dateFinDiffusion ? new Date(initialDiffusion.dateFinDiffusion).toISOString().split('T')[0] : defaultState.dateFinDiffusion),
              });
          } else { setDiffusion(defaultState); }
          setErrors({});
      }, [initialDiffusion, defaultState]);
  
      const handleChange = (e) => {
          const { name, value } = e.target;
          setDiffusion(prev => ({ ...prev, [name]: value }));
          if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
      };
  
      const handleCreneauChange = (index, field, value) => {
          const newCreneaux = [...diffusion.creneaux];
          newCreneaux[index] = { ...newCreneaux[index], [field]: value };
          setDiffusion(prev => ({ ...prev, creneaux: newCreneaux }));
          if (errors.creneaux && errors.creneaux[index] && errors.creneaux[index][field]) {
              const newCreneauErrors = [...(errors.creneaux || [])];
              if (newCreneauErrors[index]) {
                  newCreneauErrors[index][field] = '';
                  if (Object.values(newCreneauErrors[index]).every(e => !e)) { newCreneauErrors[index] = {}; }
              }
              setErrors(prev => ({ ...prev, creneaux: newCreneauErrors }));
          }
      };
      const addCreneau = () => setDiffusion(prev => ({ ...prev, creneaux: [...prev.creneaux, { heure: '', responsable: '', statut: 'Programmé' }] }));
  
      const removeCreneau = (index) => {
          const newCreneaux = diffusion.creneaux.filter((_, i) => i !== index);
          setDiffusion(prev => ({ ...prev, creneaux: newCreneaux }));
          if (errors.creneaux && errors.creneaux.length > index) {
              const newCreneauErrors = [...errors.creneaux];
              newCreneauErrors.splice(index, 1);
              setErrors(prev => ({ ...prev, creneaux: newCreneauErrors.length > 0 ? newCreneauErrors : null }));
          }
      };
  
      const validate = () => {
          const newErrors = {};
          if (!diffusion.titre.trim()) newErrors.titre = "Le titre est requis.";
          if (!diffusion.dateDebutDiffusion) newErrors.dateDebutDiffusion = "La date de début est requise.";
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
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Titre de la Diffusion/Campagne" id="titre" name="titre" value={diffusion.titre} onChange={handleChange} error={errors.titre} required />
                  <SelectField label="Catégorie" id="categorie" name="categorie" value={diffusion.categorie} onChange={handleChange} error={errors.categorie} required>
                      {categoriesDiffusion.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </SelectField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Prix Global (€)" id="prix" name="prix" type="number" value={diffusion.prix} onChange={handleChange} error={errors.prix} min="0" step="0.01" />
                  <InputField label="Durée par spot/communiqué" id="dureeElement" name="dureeElement" value={diffusion.dureeElement} onChange={handleChange} error={errors.dureeElement} placeholder="ex: 30s, 1min, 2min30s"/>
              </div>
              <SelectField label="Client Associé" id="clientId" name="clientId" value={diffusion.clientId} onChange={handleChange} error={errors.clientId}>
                  <option value="">Aucun client / Diffusion interne</option>
                  {Array.isArray(clientsData) && clientsData.map(client => <option key={client.id} value={client.id}>{client.nom} {client.prenom}</option>)}
              </SelectField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Date de Début de Campagne" id="dateDebutDiffusion" name="dateDebutDiffusion" type="date" value={diffusion.dateDebutDiffusion} onChange={handleChange} error={errors.dateDebutDiffusion} required />
                  <InputField label="Date de Fin de Campagne" id="dateFinDiffusion" name="dateFinDiffusion" type="date" value={diffusion.dateFinDiffusion} onChange={handleChange} error={errors.dateFinDiffusion} />
              </div>
              <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-lg font-semibold text-slate-700">Créneaux de Diffusion Journaliers</h4>
                  {diffusion.creneaux.map((creneau, index) => (
                      <CreneauForm key={index} creneau={creneau} index={index} onChange={handleCreneauChange} onRemove={removeCreneau} errors={errors.creneaux && errors.creneaux[index] ? errors.creneaux[index] : null}/>
                  ))}
                  <button type="button" onClick={addCreneau} className="bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium py-2 px-3 rounded-md flex items-center">
                      <PlusIcon className="w-4 h-4 mr-2"/> Ajouter un Créneau Horaire
                  </button>
              </div>
              <div className="flex justify-end space-x-3 pt-3 border-t">
                  <CancelButton onClick={onCancel}>Annuler</CancelButton>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"><SaveIcon /> {diffusion.id ? 'Mettre à jour' : 'Enregistrer'}</button>
              </div>
          </form>
      );
  };
  export default function App() {
      const [currentSection, setCurrentSection] = useState('tasks_teams'); 
const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [globalError, setGlobalError] = useState(null);

    const [clientsData, setClientsData] = useState([]);
    const [diffusionsData, setDiffusionsData] = useState([]);
    
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                if (token) { await signInWithCustomToken(auth, token); }
                else { await signInAnonymously(auth); }
            } catch (error) {
                console.error("App: Erreur auth:", error);
                setGlobalError(`Erreur d'authentification: ${error.message}.`);
            }
        };

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) { setCurrentUserId(user.uid); }
            else { setCurrentUserId(null); setClientsData([]); setDiffusionsData([]); }
            setIsAuthReady(true);
        });
        
        if (!auth.currentUser) { initializeAuth(); }
        else { setCurrentUserId(auth.currentUser.uid); setIsAuthReady(true); }
        
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!currentUserId) { setClientsData([]); return; }
        const path = `artifacts/${appId}/users/${currentUserId}/clients`;
        const unsubscribe = onSnapshot(collection(db, path), 
            (snapshot) => setClientsData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            (error) => { console.error("Erreur chargement clients (App):", error); setGlobalError("Impossible de charger les clients."); }
        );
        return () => unsubscribe();
    }, [currentUserId]);

     useEffect(() => {
        if (!currentUserId) { setDiffusionsData([]); return; }
        const path = `artifacts/${appId}/users/${currentUserId}/diffusions`;
        const unsubscribe = onSnapshot(collection(db, path),
            (snapshot) => setDiffusionsData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            (error) => { console.error("Erreur chargement diffusions (App):", error); setGlobalError("Impossible de charger les diffusions."); }
        );
        return () => unsubscribe();
    }, [currentUserId]);

    if (!isAuthReady) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
                <ArrowPathIcon className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                <p className="text-xl text-slate-700">Initialisation de l'application...</p>
            </div>
        );
    }
    
    const NavLink = ({ sectionName, children, icon }) => (
        <button onClick={() => setCurrentSection(sectionName)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${currentSection === sectionName ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-100 hover:text-blue-700'}`}>
            {icon && React.cloneElement(icon, { className: `w-5 h-5 mr-2`})}
            {children}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-100 font-inter text-slate-800">
            <header className="bg-white shadow-md no-print sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <SpeakerWaveIcon className="h-8 w-auto text-blue-600"/>
                            <span className="ml-3 font-bold text-xl text-slate-800">Radio Dashboard Pro</span>
                        </div>
                         <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                             <NavLink sectionName="tasks_teams" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<ClipboardDocumentListIcon/>}>Équipes & Tâches</NavLink>
                             <NavLink sectionName="clients" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<UserGroupIcon/>}>Clients</NavLink>
                             <NavLink sectionName="diffusions" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<MegaphoneIcon/>}>Diffusions</NavLink>
                            <NavLink sectionName="facturation" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<ListBulletIcon/>}>Facturation</NavLink>
                             <NavLink sectionName="planning" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<CalendarDaysIcon/>}>Planning</NavLink>
                            <NavLink sectionName="statistiques_financieres" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<ChartPieIcon/>}>Stats Financières</NavLink>
                             <NavLink sectionName="statistiques_diffusion" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<SpeakerWaveIcon/>}>Stats Diffusion</NavLink>
                        </nav>
                        <div className="text-sm text-slate-500">
                           {currentUserId ? <span title={currentUserId}>ID: {currentUserId.substring(0,8)}...</span> : "Non connecté"}
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                 {globalError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md relative mb-6 shadow" role="alert">
                          <strong className="font-bold">Erreur: </strong>
                          <span className="block sm:inline">{globalError}</span>
                          <button onClick={() => setGlobalError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                              <XMarkIcon className="w-5 h-5 text-red-700"/>
                          </button>
                      </div>
                  }
                  {currentSection === 'tasks_teams' && ( <SectionGestionEquipesTaches currentUserId={currentUserId} /> )}
{currentSection === 'clients' && ( <SectionGestionClients currentUserId={currentUserId} /> )}
                {currentSection === 'diffusions' && ( <SectionGestionDiffusions currentUserId={currentUserId} clientsData={clientsData} /> )}
                {currentSection === 'facturation' && <GestionFacturation clients={clientsData} communiquesEmissions={diffusionsData} currentUserId={currentUserId} /> }
                {currentSection === 'planning' && <SectionPlanning currentUserId={currentUserId} clients={clientsData} diffusionsData={diffusionsData} />}
                {currentSection === 'statistiques_financieres' && <SectionStatistiques currentUserId={currentUserId} clients={clientsData} />}
                {currentSection === 'statistiques_diffusion' && <SectionStatistiquesDiffusion currentUserId={currentUserId} clients={clientsData} communiquesEmissions={diffusionsData} />}

            </main>
            <footer className="text-center py-6 text-sm text-slate-500 border-t border-slate-200 bg-white no-print mt-12">
                © {new Date().getFullYear()} Votre Entreprise Radio. Tous droits réservés. App ID: {appId}
            </footer>
        </div>
    );
}
