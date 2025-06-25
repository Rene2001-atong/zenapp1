  import React, { useState, useEffect, useMemo } from 'react';
  import { appId} from '../firebase/config';
  import { firebaseConfig } from '../firebase/config';
  import { initializeApp } from 'firebase/app';
  import { 
      collection, 
      addDoc, 
      doc,
      updateDoc, 
      deleteDoc, 
      onSnapshot,
      getFirestore 
  } from 'firebase/firestore';
  import { PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  

const Modal = ({ isOpen, onClose, title, children, size = "lg" }) => 
{
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

const SelectField = ({ label, id, error, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select id={id} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}>
            {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

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

const CancelButton = ({ children, onClick }) => (
     <button type="button" onClick={onClick} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
        {children}
    </button>
);

const SaveButton = ({ children, onClick }) => (
     <button type="button" onClick={onClick} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
        {children}
    </button>
);

const EquipeForm = ({ initialEquipe, onSave, onCancel }) => {
      const [equipe, setEquipe] = useState({ nom: '', description: '', membres: [] });
      const [membreInput, setMembreInput] = useState('');
      const [errors, setErrors] = useState({});
  
      useEffect(() => {
            if (initialEquipe) {
                setEquipe({
                    nom: initialEquipe.nom || '',
                    description: initialEquipe.description || '',
                 membres: initialEquipe.membres || [],
                 id: initialEquipe.id,
                 });
            } else {
            setEquipe({ nom: '', description: '', membres: [] });
             }
             setErrors({});
        }, [initialEquipe]);

        const handleChange = (e) => {
        setEquipe(prev => ({ ...prev, [e.target.name]: e.target.value }));
        };

        const handleAddMembre = () => {
            if (membreInput.trim() && !equipe.membres.includes(membreInput.trim())) {
            setEquipe(prev => ({ ...prev, membres: [...prev.membres, membreInput.trim()] }));
            setMembreInput('');
            }
        };
    
        const handleRemoveMembre = (membreToRemove) => {
        setEquipe(prev => ({ ...prev, membres: prev.membres.filter(m => m !== membreToRemove)}));
        };

        const handleSubmit = (e) => {
             e.preventDefault();
                const newErrors = {};
                if (!equipe.nom.trim()) newErrors.nom = "Le nom de l'équipe est requis.";
                    setErrors(newErrors);
                 if (Object.keys(newErrors).length === 0) {
                    onSave(equipe);
            }
        };
return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Nom de l'équipe" id="nom" name="nom" value={equipe.nom} onChange={handleChange} error={errors.nom} required />
            <TextareaField label="Description" id="description" name="description" value={equipe.description} onChange={handleChange} rows="3" />
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Membres</label>
                <div className="flex gap-2">
                    <input type="text" value={membreInput} onChange={(e) => setMembreInput(e.target.value)} placeholder="Nom ou email du membre" className="flex-grow p-2 border border-slate-300 rounded-md" />
                    <button type="button" onClick={handleAddMembre} className="bg-green-500 hover:bg-green-600 text-white px-3 rounded-md">+</button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {equipe.membres.map((membre, index) => (
                        <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {membre}
                            <button type="button" onClick={() => handleRemoveMembre(membre)} className="ml-2 text-blue-500 hover:text-blue-700">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
                <CancelButton onClick={onCancel}>Annuler</CancelButton>
                <SaveButton>{equipe.id ? 'Mettre à jour' : 'Enregistrer'}</SaveButton>
            </div>
        </form>
    );
};
  
const TacheForm = ({ initialTache, onSave, onCancel, equipes, membres }) => {
      const [tache, setTache] = useState({ titre: '', description: '', assigneA: '', assigneType: 'personne', dateEcheance: '', statut: 'À faire', priorite: 'Moyenne' });
      const [errors, setErrors] = useState({});
      useEffect(() => {
          if (initialTache) {
              setTache({
                  ...initialTache,
dateEcheance: initialTache.dateEcheance?.seconds ? new Date(initialTache.dateEcheance.seconds * 1000).toISOString().split('T')[0] : (initialTache.dateEcheance || ''),
            });
        } else {
            setTache({ titre: '', description: '', assigneA: '', assigneType: 'personne', dateEcheance: '', statut: 'À faire', priorite: 'Moyenne' });
        }
        setErrors({});
    }, [initialTache]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTache(prev => ({ ...prev, [name]: value }));
        if(name === "assigneType") setTache(prev => ({ ...prev, assigneA: '' })); // Reset selection on type change
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!tache.titre.trim()) newErrors.titre = "Le titre est requis.";
        if (!tache.dateEcheance) newErrors.dateEcheance = "La date d'échéance est requise.";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSave({
                ...tache,
                dateEcheance: tache.dateEcheance ? new Date(tache.dateEcheance) : null,
            });
        }
    };

    const assignationOptions = tache.assigneType === 'equipe' ? equipes : membres.map(m => ({ id: m, nom: m }));

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Titre de la tâche" id="titre" name="titre" value={tache.titre} onChange={handleChange} error={errors.titre} required />
            <TextareaField label="Description" id="description" name="description" value={tache.description} onChange={handleChange} rows="4" />
            <div className="grid grid-cols-2 gap-4">
                <SelectField label="Assigner à" id="assigneType" name="assigneType" value={tache.assigneType} onChange={handleChange}>
                    <option value="personne">Une personne</option>
                    <option value="equipe">Une équipe</option>
                </SelectField>
                <SelectField label={tache.assigneType === 'equipe' ? "Équipe" : "Personne"} id="assigneA" name="assigneA" value={tache.assigneA} onChange={handleChange}>
                    <option value="">Non assigné</option>
                    {assignationOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.nom}</option>)}
                  </SelectField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <InputField label="Date d'échéance" id="dateEcheance" name="dateEcheance" type="date" value={tache.dateEcheance} onChange={handleChange} error={errors.dateEcheance} required />
                  <SelectField label="Priorité" id="priorite" name="priorite" value={tache.priorite} onChange={handleChange}>
                      <option>Basse</option>
<option>Moyenne</option>
                      <option>Haute</option>
                  </SelectField>
              </div>
              <SelectField label="Statut" id="statut" name="statut" value={tache.statut} onChange={handleChange}>
                  <option>À faire</option>
                  <option>En cours</option>
                  <option>Terminé</option>
                  <option>Bloqué</option>
              </SelectField>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                  <CancelButton onClick={onCancel}>Annuler</CancelButton>
                  <SaveButton>{tache.id ? 'Mettre à jour' : 'Enregistrer'}</SaveButton>
</div>
          </form>
      );
  };
  
  export default function SectionGestionEquipesTaches ({ currentUserId }) {
      const [equipes, setEquipes] = useState([]);
      const [taches, setTaches] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState(null);
      const [isEquipeModalOpen, setIsEquipeModalOpen] = useState(false);
      const [isTacheModalOpen, setIsTacheModalOpen] = useState(false);
      const [currentEquipe, setCurrentEquipe] = useState(null);
      const [currentTache, setCurrentTache] = useState(null);
      
      const [filtreEquipe, setFiltreEquipe] = useState('');
      const [filtreStatut, setFiltreStatut] = useState('');
    
      const equipesCollectionPath = useMemo(() => currentUserId ? `artifacts/${appId}/users/${currentUserId}/teams` : null, [currentUserId]);
      const tachesCollectionPath = useMemo(() => currentUserId ? `artifacts/${appId}/users/${currentUserId}/tasks` : null, [currentUserId]);
    
      useEffect(() => {
          if (!currentUserId) {
              setIsLoading(false);
              return;
          }
          setIsLoading(true);
          const unsubEquipes = onSnapshot(collection(db, equipesCollectionPath), 
snap => setEquipes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            err => { setError("Erreur chargement équipes"); console.error(err); }
        );
        const unsubTaches = onSnapshot(collection(db, tachesCollectionPath),
            snap => { setTaches(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))); setIsLoading(false); },
            err => { setError("Erreur chargement tâches"); console.error(err); setIsLoading(false); }
        );
        return () => { unsubEquipes(); unsubTaches(); };
    }, [equipesCollectionPath, tachesCollectionPath, currentUserId]);

    const handleSaveEquipe = async (data) => {
        if (!equipesCollectionPath) return;
        const { id, ...equipeData } = data;
        try {
            if (id) {
                await updateDoc(doc(db, equipesCollectionPath, id), equipeData);
            } else {
                await addDoc(collection(db, equipesCollectionPath), equipeData);
            }
            setIsEquipeModalOpen(false);
        } catch (err) { setError("Erreur sauvegarde équipe"); console.error(err); }
    };
    
    const handleSaveTache = async (data) => {
        if (!tachesCollectionPath) return;
        const { id, ...tacheData } = data;
        try {
            if (id) {
                await updateDoc(doc(db, tachesCollectionPath, id), tacheData);
            } else {
                await addDoc(collection(db, tachesCollectionPath), tacheData);
            }
            setIsTacheModalOpen(false);
        } catch (err) { setError("Erreur sauvegarde tâche"); console.error(err); }
    };

    const handleDelete = async (collectionPath, id, itemName) => {
        if (!collectionPath) return;
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer cet élément : ${itemName} ?`)) {
            try {
                await deleteDoc(doc(db, collectionPath, id));
            } catch (err) { setError(`Erreur suppression ${itemName}`); console.error(err); }
        }
    };

    const allMembres = useMemo(() => {
        const membresSet = new Set(equipes.flatMap(e => e.membres));
        return Array.from(membresSet).sort();
    }, [equipes]);

    const tachesFiltrees = useMemo(() => {
        return taches.filter(tache => {
            const equipeMatch = !filtreEquipe || (tache.assigneType === 'equipe' && tache.assigneA === filtreEquipe);
            const statutMatch = !filtreStatut || tache.statut === filtreStatut;
            return equipeMatch && statutMatch;
        });
    }, [taches, filtreEquipe, filtreStatut]);

    // const getStatutColor = (statut) => {
    //     switch (statut) {
    //         case 'À faire': return 'bg-slate-200 text-slate-700';
    //         case 'En cours': return 'bg-yellow-100 text-yellow-700';
    //         case 'Terminé': return 'bg-green-100 text-green-700';
    //         case 'Bloqué': return 'bg-red-100 text-red-700';
    //         default: return 'bg-slate-100';
    //     }
    //   };
      
//       const getPrioriteColor = (priorite) => {
//           switch (priorite) {
//               case 'Basse': return 'text-green-600';
//               case 'Moyenne': return 'text-yellow-600';
// case 'Haute': return 'text-red-600';
//             default: return 'text-slate-500';
//         }
//     };
    
    const getAssignationName = (tache) => {
        if (!tache.assigneA) return <span className="italic text-slate-500">Non assigné</span>;
        if (tache.assigneType === 'equipe') {
            const equipe = equipes.find(e => e.id === tache.assigneA);
            return <span className="font-semibold">{equipe ? equipe.nom : 'Équipe inconnue'}</span>;
        }
        return <span className="font-semibold">{tache.assigneA}</span>;
    };


    if (!currentUserId) return <div className="p-6 bg-white rounded-xl shadow-lg text-center text-slate-500">Veuillez vous connecter pour gérer les équipes et tâches.</div>;
      return (
          <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg min-h-screen">
              {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
              {isLoading ? <div className="text-center py-8"><ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin inline"/> Chargement...</div> : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1 space-y-4">
                          <div className="flex justify-between items-center">
                              <h3 className="text-2xl font-bold text-slate-800">Équipes</h3>
                              <button onClick={() => { setCurrentEquipe(null); setIsEquipeModalOpen(true); }} className="bg-white hover:bg-slate-100 text-blue-600 font-semibold py-2 px-3 rounded-lg shadow-sm border border-slate-200 flex items-center"><PlusIcon className="w-4 h-4 mr-1"/> Ajouter</button>
                          </div>
                          <div className="space-y-3">
                              {equipes.map(equipe => (
<div key={equipe.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-slate-800">{equipe.nom}</p>
                                            <p className="text-sm text-slate-500">{equipe.description}</p>
                                        </div>
                                        <div className="flex-shrink-0 space-x-1">
                                            <button onClick={() => { setCurrentEquipe(equipe); setIsEquipeModalOpen(true); }} className="text-yellow-600 p-1"><PencilIcon className="w-4 h-4"/></button>
                                            <button onClick={() => handleDelete(equipesCollectionPath, equipe.id, equipe.nom)} className="text-red-600 p-1"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-slate-600">
                                        <span className="font-medium">Membres:</span> {equipe.membres.join(', ')}
                                    </div>
                                </div>
                            ))}
                              {equipes.length === 0 && <p className="text-center py-4 text-slate-500">Aucune équipe créée.</p>}
                          </div>
                      </div>
  
                      <div className="lg:col-span-2 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                              <h3 className="text-2xl font-bold text-slate-800">Tâches</h3>
                              <div className="flex gap-2">
                                  <SelectField label="" id="filtreEquipe" value={filtreEquipe} onChange={e => setFiltreEquipe(e.target.value)}>
                                      <option value="">Toutes les équipes</option>
                                      {equipes.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
</SelectField>
                                <SelectField label="" id="filtreStatut" value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)}>
                                    <option value="">Tous les statuts</option>
                                    <option>À faire</option>
                                    <option>En cours</option>
                                    <option>Terminé</option>
                                    <option>Bloqué</option>
                                </SelectField>
                            </div>
                            <button onClick={() => { setCurrentTache(null); setIsTacheModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center w-full sm:w-auto justify-center"><PlusIcon className="w-5 h-5 mr-2"/>Nouvelle Tâche</button>
                        </div>
                        <div className="space-y-3">
                              {tachesFiltrees.map(tache => (
                                  <div key={tache.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                      <div className="flex justify-between items-start gap-2">
                                          <div className="flex-grow">
                                              <p className="font-semibold text-slate-800">{tache.titre}</p>
                                              <p className="text-sm text-slate-500">{tache.description}</p>
                                          </div>
                                          <div className="flex flex-col items-end flex-shrink-0">
                                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatutColor(tache.statut)}`}>{tache.statut}</span>
                                              <div className="flex mt-2">
                                                  <button onClick={() => { setCurrentTache(tache); setIsTacheModalOpen(true); }} className="text-yellow-600 p-1"><PencilIcon className="w-4 h-4"/></button>
                                                  <button onClick={() => handleDelete(tachesCollectionPath, tache.id, tache.titre)} className="text-red-600 p-1"><TrashIcon className="w-4 h-4"/></button>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="mt-2 text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1 items-center border-t pt-2">
                                          <span><UserGroupIcon className="w-3 h-3 inline mr-1"/>Assigné à: {getAssignationName(tache)}</span>
                                          <span><CalendarDaysIcon className="w-3 h-3 inline mr-1"/>Échéance: {tache.dateEcheance?.seconds ? new Date(tache.dateEcheance.seconds*1000).toLocaleDateString('fr-FR') : 'N/A'}</span>
                                          <span className={getPrioriteColor(tache.priorite)}><ChevronDownIcon className="w-3 h-3 inline mr-1 transform rotate-180"/>Priorité: {tache.priorite}</span>
                                      </div>
                                  </div>
                              ))}
                              {tachesFiltrees.length === 0 && <p className="text-center py-4 text-slate-500">Aucune tâche ne correspond à vos filtres.</p>}
</div>
                      </div>
                  </div>
              )}
  
              <Modal isOpen={isEquipeModalOpen} onClose={() => setIsEquipeModalOpen(false)} title={currentEquipe ? "Modifier l'Équipe" : "Créer une Équipe"}>
                  <EquipeForm initialEquipe={currentEquipe} onSave={handleSaveEquipe} onCancel={() => setIsEquipeModalOpen(false)} />
              </Modal>
              <Modal isOpen={isTacheModalOpen} onClose={() => setIsTacheModalOpen(false)} title={currentTache ? "Modifier la Tâche" : "Créer une Tâche"} size="xl">
                  <TacheForm initialTache={currentTache} onSave={handleSaveTache} onCancel={() => setIsTacheModalOpen(false)} equipes={equipes} membres={allMembres} />
              </Modal>
          </div>
);
};