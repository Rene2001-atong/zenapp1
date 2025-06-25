// // import React, { useState, useEffect, useMemo } from 'react';
// import { db, auth, appId } from '../firebase/config'; // Assurez-vous que le chemin est correct
// import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
// import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
// import React, { useState, useEffect, useMemo } from 'react';
// import { appId, db,app } from '../firebase/config';
// import { 
//     firebaseConfig,
//     getFirestore, 
//     collection, 
//     addDoc, 
//     doc, 
//     updateDoc, 
//     deleteDoc, 
//     onSnapshot 
// } from 'firebase/firestore';
// // import React, { useState, useEffect, useCallback, useMemo } from 'react';

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);


// // ***** Section Gestion des Clients *****
// export const  ClientForm = ({ initialClient, onSave, onCancel }) => {
//     const [client, setClient] = useState({ nom: '', prenom: '', tel: '', email: '', adresse: '', notes: '' });
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         if (initialClient) {
//             setClient(initialClient);
//         } else {
//             setClient({ nom: '', prenom: '', tel: '', email: '', adresse: '', notes: '' });
//         }
//         setErrors({});
//     }, [initialClient]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setClient(prev => ({ ...prev, [name]: value }));
//         if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
//     };

//     const validate = () => {
//         const newErrors = {};
//         if (!client.nom.trim()) newErrors.nom = "Le nom est requis.";
//         if (!client.prenom.trim()) newErrors.prenom = "Le prénom est requis.";
//         if (!client.tel.trim()) newErrors.tel = "Le téléphone est requis.";
//         else if (!/^\+?[0-9\s-()]*$/.test(client.tel)) newErrors.tel = "Format de téléphone invalide.";
//         if (client.email.trim() && !/\S+@\S+\.\S+/.test(client.email)) newErrors.email = "Format d'email invalide.";
        
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validate()) {
//             onSave(client);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <InputField label="Nom" id="nom" name="nom" value={client.nom} onChange={handleChange} error={errors.nom} required />
//             <InputField label="Prénom" id="prenom" name="prenom" value={client.prenom} onChange={handleChange} error={errors.prenom} required />
//             <InputField label="Téléphone" id="tel" name="tel" type="tel" value={client.tel} onChange={handleChange} error={errors.tel} required />
//             <InputField label="Email" id="email" name="email" type="email" value={client.email} onChange={handleChange} error={errors.email} />
//             <TextareaField label="Adresse" id="adresse" name="adresse" value={client.adresse} onChange={handleChange} rows="2" />
//             <TextareaField label="Notes" id="notes" name="notes" value={client.notes} onChange={handleChange} rows="3" />
//             <div className="flex justify-end space-x-3 pt-3 border-t">
//                 <button type="button" onClick={onCancel} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-md text-sm font-medium">Annuler</button>
//                 <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"><SaveIcon /> {client.id ? 'Mettre à jour' : 'Enregistrer'}</button>
//             </div>
//         </form>
//     );
// };

// export const SectionGestionClients = ({ currentUserId }) => {
//     const [clients, setClients] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [currentClient, setCurrentClient] = useState(null);
//     const [error, setError] = useState(null);
    
//     const clientsCollectionPath = useMemo(() => {
//         if (!currentUserId) return null;
//         return `artifacts/${appId}/users/${currentUserId}/clients`;
//     }, [currentUserId]);

//     useEffect(() => {
//         if (!clientsCollectionPath) {
//             setIsLoading(false);
//             setClients([]);
//             return () => {};
//         }
//         setIsLoading(true);
//         const unsubscribe = onSnapshot(collection(db, clientsCollectionPath), 
//             (snapshot) => {
//                 setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//                 setIsLoading(false);
//             }, 
//             (err) => {
//                 console.error("Erreur de lecture des clients:", err);
//                 setError("Impossible de charger les clients.");
//                 setIsLoading(false);
//             }
//         );
//         return () => unsubscribe();
//     }, [clientsCollectionPath]);

//     const handleSaveClient = async (clientData) => {
//         if (!clientsCollectionPath) {
//             setError("Chemin de collection non défini (ID utilisateur manquant ?).");
//             return;
//         }
//         try {
//             if (clientData.id) {
//                 const { id, ...dataToUpdate } = clientData;
//                 await updateDoc(doc(db, clientsCollectionPath, id), dataToUpdate);
//             } else {
//                 await addDoc(collection(db, clientsCollectionPath), clientData);
//             }
//             setIsModalOpen(false);
//             setCurrentClient(null);
//         } catch (err) {
//             console.error("Erreur sauvegarde client:", err);
//             setError("Échec de la sauvegarde du client.");
//         }
//     };

//     const handleDeleteClient = async (clientId) => {
//         if (!clientsCollectionPath) {
//              setError("Chemin de collection non défini.");
//              return;
//         }
//         if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
//             try {
//                 await deleteDoc(doc(db, clientsCollectionPath, clientId));
//             } catch (err) {
//                 console.error("Erreur suppression client:", err);
//                 setError("Échec de la suppression du client.");
//             }
//         }
//     };

//     if (!currentUserId) return <div className="p-6 bg-white rounded-xl shadow-lg text-center text-slate-500">Veuillez vous connecter pour gérer les clients.</div>;

//     return (
//         <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg min-h-screen">
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-3xl font-bold text-slate-800">Gestion des Clients</h2>
//                 <button onClick={() => { setCurrentClient(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"><PlusIcon className="w-5 h-5 mr-2"/>Nouveau Client</button>
//             </div>
//             {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
//             {isLoading ? <div className="text-center py-8"><ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin inline"/> Chargement...</div> : (
//                 <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//                     <table className="min-w-full divide-y divide-slate-200">
//                         <thead className="bg-slate-100">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nom</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Prénom</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Téléphone</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-200">
//                             {clients.map(client => (
//                                 <tr key={client.id} className="hover:bg-slate-50">
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{client.nom}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{client.prenom}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{client.tel}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{client.email}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
//                                         <button onClick={() => { setCurrentClient(client); setIsModalOpen(true); }} className="text-yellow-600 hover:text-yellow-800 p-1"><PencilIcon className="w-5 h-5"/></button>
//                                         <button onClick={() => handleDeleteClient(client.id)} className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
//                                     </td>
//                                 </tr>
//                             ))}
//                              {clients.length === 0 && <tr><td colSpan="5" className="text-center py-6 text-slate-500">Aucun client enregistré.</td></tr>}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentClient ? "Modifier Client" : "Ajouter Client"} size="lg">
//                 <ClientForm initialClient={currentClient} onSave={handleSaveClient} onCancel={() => setIsModalOpen(false)} />
//             </Modal>
//         </div>
//     );
// };
// export default ClientForm;

import React, { useState, useEffect, useMemo } from 'react';
import { db, auth, appId } from '../firebase/config'; // Assurez-vous que le chemin est correct
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Note : Les composants Modal, InputField, etc. devraient être dans un dossier src/components/ pour être importés ici.
// Pour la simplicité de cet exemple, je les redéfinis, mais la bonne pratique est de les centraliser.

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

const ClientForm = ({ initialClient, onSave, onCancel }) => {
    const [client, setClient] = useState({ nom: '', prenom: '', tel: '', email: '', adresse: '', notes: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setClient(initialClient || { nom: '', prenom: '', tel: '', email: '', adresse: '', notes: '' });
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
                <button type="button" onClick={onCancel} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-md text-sm font-medium">Annuler</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">{client.id ? 'Mettre à jour' : 'Enregistrer'}</button>
            </div>
        </form>
    );
};

export default function SectionGestionClients({ currentUserId }) {
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
        if (!clientsCollectionPath) {
            setIsLoading(false);
            setClients([]);
            return;
        }
        setIsLoading(true);
        const unsubscribe = onSnapshot(collection(db, clientsCollectionPath), 
            (snapshot) => {
                setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setIsLoading(false);
            }, 
            (err) => {
                setError("Impossible de charger les clients.");
                setIsLoading(false);
            }
        );
        return () => unsubscribe();
    }, [clientsCollectionPath]);

    const handleSaveClient = async (clientData) => {
        if (!clientsCollectionPath) return;
        try {
            if (clientData.id) {
                const { id, ...dataToUpdate } = clientData;
                await updateDoc(doc(db, clientsCollectionPath, id), dataToUpdate);
            } else {
                await addDoc(collection(db, clientsCollectionPath), clientData);
            }
            setIsModalOpen(false);
            setCurrentClient(null);
        } catch (err) {
            setError("Échec de la sauvegarde du client.");
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (!clientsCollectionPath) return;
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
            try {
                await deleteDoc(doc(db, clientsCollectionPath, clientId));
            } catch (err) {
                 setError("Échec de la suppression du client.");
            }
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