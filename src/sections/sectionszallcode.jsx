import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { firebaseConfig,appId } from '../firebase/config';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    onAuthStateChanged,
    signInWithCustomToken
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot 
} from 'firebase/firestore';
import { ArrowPathIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, PrinterIcon, XMarkIcon, MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon, BanknotesIcon, DocumentChartBarIcon, UsersIcon, ChartPieIcon, CalendarDaysIcon, ListBulletIcon, SpeakerWaveIcon, TagIcon, ClockIcon, AdjustmentsHorizontalIcon, UserGroupIcon, MegaphoneIcon } from '@heroicons/react/24/outline';


// // Configuration Firebase (sera injectée par l'environnement d'exécution)
// const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_STORAGE_BUCKET",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ID de l'application (sera injecté par l'environnement d'exécution)
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Icônes pour l'interface utilisateur
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// Composant Input avec gestion d'erreur
const InputField = ({ label, id, error, type = "text", ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={id} type={type} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'} transition-shadow`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

// Composant Select avec gestion d'erreur
const SelectField = ({ label, id, error, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select id={id} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'} transition-shadow`}>
            {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

// Composant Textarea avec gestion d'erreur
const TextareaField = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={id} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'} transition-shadow`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);


// Composant Modal générique
const Modal = ({ isOpen, onClose, title, children, size = "2xl" }) => {
    if (!isOpen) return null;
    
    const maxWidthClass = {
        "sm": "max-w-sm",
        "md": "max-w-md",
        "lg": "max-w-lg",
        "xl": "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
    }[size];


    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out">
            <div className={`bg-white p-6 rounded-xl shadow-2xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-slate-700">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"
                    >
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"> 
                    {children}
                </div>
            </div>
            <style jsx global>{`
                @keyframes modalShow {
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-modalShow {
                    animation: modalShow 0.3s forwards;
                }
            `}</style>
        </div>
    );
};

// Composant pour un élément de ligne de facture dans le formulaire
const InvoiceItemForm = ({ item, index, onChange, onRemove, error }) => {
    const handleItemChange = (field, value) => {
        onChange(index, field, value);
    };

    return (
        <div className={`grid grid-cols-1 md:grid-cols-10 gap-3 mb-3 p-3 border ${error ? 'border-red-300' : 'border-slate-200'} rounded-lg items-start`}>
            <div className="md:col-span-4">
                <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange('description', e.target.value)}
                    className={`w-full p-2 border ${error?.description ? 'border-red-500' : 'border-slate-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow`}
                />
                {error?.description && <p className="mt-1 text-xs text-red-600">{error.description}</p>}
            </div>
            <div className="md:col-span-1">
                <input
                    type="number"
                    placeholder="Qté"
                    value={item.quantite}
                    onChange={(e) => handleItemChange('quantite', parseFloat(e.target.value) || '')}
                    className={`w-full p-2 border ${error?.quantite ? 'border-red-500' : 'border-slate-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow`}
                    min="0"
                    step="any"
                />
                {error?.quantite && <p className="mt-1 text-xs text-red-600">{error.quantite}</p>}
            </div>
             <div className="md:col-span-2">
                <input
                    type="number"
                    placeholder="Prix Unit."
                    value={item.prixUnitaire}
                    onChange={(e) => handleItemChange('prixUnitaire', parseFloat(e.target.value) || '')}
                    className={`w-full p-2 border ${error?.prixUnitaire ? 'border-red-500' : 'border-slate-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow`}
                    min="0"
                    step="any"
                />
                {error?.prixUnitaire && <p className="mt-1 text-xs text-red-600">{error.prixUnitaire}</p>}
            </div>
            <p className="md:col-span-2 p-2 text-slate-700 text-right self-center">
                {(parseFloat(item.quantite) * parseFloat(item.prixUnitaire) || 0).toFixed(2)} €
            </p>
            <button 
                type="button" 
                onClick={() => onRemove(index)}
                className="md:col-span-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center justify-center transition-colors self-center"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    );
};


// Formulaire pour créer/modifier une facture
const FactureForm = ({ initialFacture, onSave, onCancel, clients, communiquesEmissions }) => {
    const defaultFactureState = {
        id: null,
        numeroFacture: `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Date.now().toString().slice(-4)}`,
        clientId: '',
        clientDetails: { nom: '', prenom: '', tel: '', email: '' },
        dateEmission: new Date().toISOString().split('T')[0],
        dateEcheance: '',
        items: [{ description: '', quantite: 1, prixUnitaire: 0, type: '' }],
        sousTotal: 0,
        tvaPourcentage: 20,
        montantTva: 0,
        totalAvecTva: 0,
        montantPaye: 0,
        soldeDu: 0,
        statut: 'Brouillon',
        notes: '',
        responsableDiffusion: '',
        planAbonnementDetails: ''
    };
    const [facture, setFacture] = useState(defaultFactureState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialFacture) {
            setFacture({
                ...initialFacture,
                dateEmission: initialFacture.dateEmission?.seconds ? new Date(initialFacture.dateEmission.seconds * 1000).toISOString().split('T')[0] : (initialFacture.dateEmission ? new Date(initialFacture.dateEmission).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
                dateEcheance: initialFacture.dateEcheance?.seconds ? new Date(initialFacture.dateEcheance.seconds * 1000).toISOString().split('T')[0] : (initialFacture.dateEcheance ? new Date(initialFacture.dateEcheance).toISOString().split('T')[0] : ''),
                items: initialFacture.items && initialFacture.items.length > 0 ? initialFacture.items.map(item => ({...item, type: item.type || ''})) : [{ description: '', quantite: 1, prixUnitaire: 0, type: '' }],
            });
        } else {
            setFacture(defaultFactureState);
        }
        setErrors({});
    }, [initialFacture]);

    const calculateTotals = useCallback((items, tvaPourcentage, montantPaye) => {
        const sousTotal = items.reduce((sum, item) => sum + (parseFloat(item.quantite) * parseFloat(item.prixUnitaire) || 0), 0);
        const montantTva = (sousTotal * parseFloat(tvaPourcentage)) / 100;
        const totalAvecTva = sousTotal + montantTva;
        const soldeDu = totalAvecTva - (parseFloat(montantPaye) || 0);
        setFacture(prev => ({ ...prev, sousTotal, montantTva, totalAvecTva, soldeDu }));
    }, []);

    useEffect(() => {
        calculateTotals(facture.items, facture.tvaPourcentage, facture.montantPaye);
    }, [facture.items, facture.tvaPourcentage, facture.montantPaye, calculateTotals]);

    const validateField = (name, value) => {
        let errorMsg = '';
        switch (name) {
            case 'numeroFacture':
                if (!value.trim()) errorMsg = "Le numéro de facture est requis.";
                break;
            case 'clientId':
                if (!value) errorMsg = "Veuillez sélectionner un client.";
                break;
            case 'dateEmission':
                if (!value) errorMsg = "La date d'émission est requise.";
                break;
            case 'tvaPourcentage':
                if (value === '' || isNaN(parseFloat(value)) || parseFloat(value) < 0) errorMsg = "La TVA doit être un nombre positif ou zéro.";
                break;
            case 'montantPaye':
                 if (value !== '' && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) errorMsg = "Le montant payé doit être un nombre positif ou zéro.";
                break;
            default:
                break;
        }
        return errorMsg;
    };
    
    const validateItems = (items) => {
        const itemErrors = [];
        let hasError = false;
        items.forEach((item, index) => {
            const currentItemErrors = {};
            if (!item.description.trim()) {
                currentItemErrors.description = "La description est requise.";
                hasError = true;
            }
            if (item.quantite === '' || isNaN(parseFloat(item.quantite)) || parseFloat(item.quantite) <= 0) {
                currentItemErrors.quantite = "La quantité doit être un nombre positif.";
                hasError = true;
            }
            if (item.prixUnitaire === '' || isNaN(parseFloat(item.prixUnitaire)) || parseFloat(item.prixUnitaire) < 0) {
                currentItemErrors.prixUnitaire = "Le prix unitaire doit être positif ou zéro.";
                hasError = true;
            }
            if (!item.type) {
                currentItemErrors.type = "La catégorie de l'article est requise.";
                hasError = true;
            }
            itemErrors[index] = currentItemErrors;
        });
        return hasError ? itemErrors : null;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        if (name === "tvaPourcentage" || name === "montantPaye") {
            processedValue = value === '' ? '' : parseFloat(value);
        }

        setFacture(prev => ({ ...prev, [name]: processedValue }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (name === "clientId") {
            const selectedClient = clients.find(c => c.id === value);
            setFacture(prev => ({
                ...prev,
                clientId: value,
                clientDetails: selectedClient ? { nom: selectedClient.nom, prenom: selectedClient.prenom, tel: selectedClient.tel, email: selectedClient.email } : { nom: '', prenom: '', tel: '', email: '' }
            }));
        }
    };
    
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const errorMsg = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };


    const handleItemChange = (index, field, value) => {
        const newItems = [...facture.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFacture(prev => ({ ...prev, items: newItems }));
        
        if (errors.items && errors.items[index] && errors.items[index][field]) {
            const newItemErrors = [...(errors.items || [])];
            if (newItemErrors[index]) {
                newItemErrors[index][field] = '';
                if (Object.values(newItemErrors[index]).every(e => !e)) {
                    newItemErrors[index] = {}; 
                }
            }
            setErrors(prev => ({ ...prev, items: newItemErrors }));
        }
    };

    const addItem = () => {
        setFacture(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantite: 1, prixUnitaire: 0, type: '' }]
        }));
    };

    const removeItem = (index) => {
        const newItems = facture.items.filter((_, i) => i !== index);
        setFacture(prev => ({ ...prev, items: newItems }));
        if (errors.items && errors.items.length > index) {
            const newItemErrors = [...errors.items];
            newItemErrors.splice(index, 1);
            setErrors(prev => ({ ...prev, items: newItemErrors.length > 0 ? newItemErrors : null }));
        }
    };
    
    const handleCommuniqueSelect = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;
        const selectedCommunique = communiquesEmissions.find(ce => ce.id === selectedId);
        if (selectedCommunique) {
            const newItem = {
                description: `${selectedCommunique.titre} (${selectedCommunique.categorie})`,
                quantite: 1,
                prixUnitaire: selectedCommunique.prix || 0,
                itemId: selectedCommunique.id,
                type: selectedCommunique.categorie
            };
            const firstEmptyItemIndex = facture.items.findIndex(it => !it.description && it.quantite === 1 && it.prixUnitaire === 0);
            if (firstEmptyItemIndex !== -1 && facture.items.length === 1 && !facture.items[0].description) {
                 const updatedItems = [...facture.items];
                 updatedItems[firstEmptyItemIndex] = newItem;
                 setFacture(prev => ({ ...prev, items: updatedItems }));
            } else {
                setFacture(prev => ({ ...prev, items: [...prev.items, newItem]}));
            }
            setFacture(prev => ({
                ...prev,
                responsableDiffusion: selectedCommunique.responsableDiffusion || prev.responsableDiffusion,
                planAbonnementDetails: selectedCommunique.planAbonnementDetails || prev.planAbonnementDetails
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = {};

        Object.keys(facture).forEach(key => {
            if (typeof validateField(key, facture[key]) === 'string' && validateField(key, facture[key])) {
                 newErrors[key] = validateField(key, facture[key]);
                 if(newErrors[key]) formIsValid = false;
            }
        });
        
        const itemValidationResult = validateItems(facture.items);
        if (itemValidationResult) {
            newErrors.items = itemValidationResult;
            formIsValid = false;
        }
        if (facture.items.length === 0) {
            newErrors.itemsGlobal = "Au moins un article est requis dans la facture.";
            formIsValid = false;
        }

        setErrors(newErrors);

        if (formIsValid) {
            const sousTotal = facture.items.reduce((sum, item) => sum + (parseFloat(item.quantite) * parseFloat(item.prixUnitaire) || 0), 0);
            const montantTva = (sousTotal * parseFloat(facture.tvaPourcentage)) / 100;
            const totalAvecTva = sousTotal + montantTva;
            const soldeDu = totalAvecTva - (parseFloat(facture.montantPaye) || 0);
            onSave({ ...facture, sousTotal, montantTva, totalAvecTva, soldeDu });
        } else {
            console.log("Formulaire invalide:", newErrors);
            const firstErrorField = document.querySelector('.border-red-500');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };
    
    const statutOptions = ["Brouillon", "Envoyée", "Payée", "Partiellement Payée", "Annulée", "En Retard"];
    const categoriesCommuniques = useMemo(() => {
        // Utilise les catégories des props communiquesEmissions qui sont passées au formulaire de facture
        // Cela devrait être cohérent avec ce qui peut être ajouté comme item
        const uniqueCategories = new Set(communiquesEmissions.map(ce => ce.categorie));
        return Array.from(uniqueCategories);
    }, [communiquesEmissions]);


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                    label="Numéro de Facture" 
                    type="text" 
                    name="numeroFacture" 
                    id="numeroFacture" 
                    value={facture.numeroFacture} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    error={errors.numeroFacture}
                    required 
                />
                <SelectField 
                    label="Client" 
                    name="clientId" 
                    id="clientId" 
                    value={facture.clientId} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    error={errors.clientId}
                    required
                >
                    <option value="">Sélectionner un client</option>
                    {/* S'assurer que 'clients' est un tableau avant de mapper */}
                    {Array.isArray(clients) && clients.map(client => (
                        <option key={client.id} value={client.id}>{client.nom} {client.prenom}</option>
                    ))}
                </SelectField>
            </div>

            {facture.clientId && facture.clientDetails && (
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <h4 className="text-md font-semibold text-slate-600 mb-2">Détails du Client Sélectionné</h4>
                    <p className="text-sm text-slate-500"><strong>Nom:</strong> {facture.clientDetails.nom} {facture.clientDetails.prenom}</p>
                    <p className="text-sm text-slate-500"><strong>Tel:</strong> {facture.clientDetails.tel}</p>
                    <p className="text-sm text-slate-500"><strong>Email:</strong> {facture.clientDetails.email}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                    label="Date d'Émission" 
                    type="date" 
                    name="dateEmission" 
                    id="dateEmission" 
                    value={facture.dateEmission} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    error={errors.dateEmission}
                    required 
                />
                <InputField 
                    label="Date d'Échéance" 
                    type="date" 
                    name="dateEcheance" 
                    id="dateEcheance" 
                    value={facture.dateEcheance} 
                    onChange={handleChange} 
                />
            </div>
            
            <div>
                <label htmlFor="communiqueSelect" className="block text-sm font-medium text-slate-700 mb-1">Ajouter un Communiqué/Émission existant</label>
                <select id="communiqueSelect" onChange={handleCommuniqueSelect} defaultValue="" className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow mb-4">
                    <option value="" disabled>Sélectionner pour ajouter...</option>
                     {/* S'assurer que 'communiquesEmissions' est un tableau */}
                    {Array.isArray(communiquesEmissions) && communiquesEmissions.map(ce => (
                        <option key={ce.id} value={ce.id}>{ce.titre} ({ce.categorie}) - {ce.prix}€</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <h4 className="text-lg font-semibold text-slate-700 mb-2">Lignes d'Articles</h4>
                {errors.itemsGlobal && <p className="text-sm text-red-600 mb-2">{errors.itemsGlobal}</p>}
                {facture.items.map((item, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-1">
                        <InvoiceItemForm 
                            item={item} 
                            index={index} 
                            onChange={handleItemChange} 
                            onRemove={removeItem}
                            error={errors.items && errors.items[index] ? errors.items[index] : null}
                        />
                        <div className="px-3 pb-3">
                             <SelectField 
                                label="Catégorie de l'article"
                                name="type"
                                id={`item-type-${index}`}
                                value={item.type}
                                onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                                error={errors.items && errors.items[index] ? errors.items[index]?.type : null}
                            >
                                <option value="">Choisir une catégorie...</option>
                                {categoriesCommuniques.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="Autre">Autre (Préciser dans description)</option>
                            </SelectField>
                        </div>
                    </div>
                ))}
                <button 
                    type="button" 
                    onClick={addItem}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-2" /> Ajouter un article manuel
                </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-3">
                <h4 className="text-md font-semibold text-slate-600 mb-2">Calcul des Totaux</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                        label="TVA (%)" 
                        type="number" 
                        name="tvaPourcentage" 
                        id="tvaPourcentage" 
                        value={facture.tvaPourcentage} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        error={errors.tvaPourcentage}
                        min="0" step="0.01"
                    />
                    <InputField 
                        label="Montant Payé (€)" 
                        type="number" 
                        name="montantPaye" 
                        id="montantPaye" 
                        value={facture.montantPaye} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        error={errors.montantPaye}
                        min="0" step="0.01"
                    />
                </div>
                <div className="text-right space-y-1 mt-3">
                    <p className="text-slate-600">Sous-total: <span className="font-semibold">{facture.sousTotal.toFixed(2)} €</span></p>
                    <p className="text-slate-600">Montant TVA: <span className="font-semibold">{facture.montantTva.toFixed(2)} €</span></p>
                    <p className="text-xl font-bold text-slate-800">Total: {facture.totalAvecTva.toFixed(2)} €</p>
                    <p className="text-lg font-semibold text-red-600">Solde Dû: {facture.soldeDu.toFixed(2)} €</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                    label="Statut" 
                    name="statut" 
                    id="statut" 
                    value={facture.statut} 
                    onChange={handleChange}
                >
                    {statutOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </SelectField>
                 <InputField 
                    label="Responsable Diffusion" 
                    type="text" 
                    name="responsableDiffusion" 
                    id="responsableDiffusion" 
                    value={facture.responsableDiffusion} 
                    onChange={handleChange} 
                 />
            </div>
            
            <div>
                <label htmlFor="planAbonnementDetails" className="block text-sm font-medium text-slate-700 mb-1">Détails Plan Abonnement</label>
                <textarea name="planAbonnementDetails" id="planAbonnementDetails" value={facture.planAbonnementDetails} onChange={handleChange} rows="2" className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"></textarea>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea name="notes" id="notes" value={facture.notes} onChange={handleChange} rows="3" className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out flex items-center"
                >
                    <CancelIcon /> Annuler
                </button>
                <button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out flex items-center"
                >
                    <SaveIcon /> {initialFacture?.id ? 'Mettre à jour' : 'Enregistrer'} la Facture
                </button>
            </div>
        </form>
    );
};

// Liste des factures
const FactureList = ({ factures, onEdit, onDelete, onView, sortConfig, requestSort, filterText, setFilterText, filterStatus, setFilterStatus }) => {
    
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />;
        }
        return null;
    };

    const statutOptions = ["Tous", "Brouillon", "Envoyée", "Payée", "Partiellement Payée", "Annulée", "En Retard"];


    if (!factures || factures.length === 0 && (filterText || filterStatus)) {
         return (
            <>
                <div className="mb-6 flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl shadow">
                    <div className="relative flex-grow">
                        <input 
                            type="text"
                            placeholder="Filtrer par N° facture ou client..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="w-full p-3 pl-10 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:w-auto w-full transition-shadow"
                    >
                        {statutOptions.map(opt => <option key={opt} value={opt === "Tous" ? "" : opt}>{opt}</option>)}
                    </select>
                </div>
                <p className="text-center text-slate-500 py-8 bg-white rounded-xl shadow-lg">Aucune facture ne correspond à vos critères de recherche.</p>
            </>
        );
    }
    
    if (!factures || factures.length === 0) {
        return <p className="text-center text-slate-500 py-8 bg-white rounded-xl shadow-lg">Aucune facture à afficher pour le moment.</p>;
    }


    const getStatusColor = (status) => {
        switch (status) {
            case 'Payée': return 'bg-green-100 text-green-700';
            case 'Partiellement Payée': return 'bg-yellow-100 text-yellow-700';
            case 'Envoyée': return 'bg-blue-100 text-blue-700';
            case 'En Retard': return 'bg-red-100 text-red-700';
            case 'Annulée': return 'bg-slate-200 text-slate-600';
            case 'Brouillon':
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <>
            <div className="mb-6 flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl shadow">
                 <div className="relative flex-grow">
                    <input 
                        type="text"
                        placeholder="Filtrer par N° facture ou client..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full p-3 pl-10 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:w-auto w-full transition-shadow"
                >
                    {statutOptions.map(opt => <option key={opt} value={opt === "Tous" ? "" : opt}>{opt}</option>)}
                </select>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('numeroFacture')}>N° Facture {getSortIndicator('numeroFacture')}</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('clientDetails.nom')}>Client {getSortIndicator('clientDetails.nom')}</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('dateEmission')}>Date Émission {getSortIndicator('dateEmission')}</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('totalAvecTva')}>Total {getSortIndicator('totalAvecTva')}</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('statut')}>Statut {getSortIndicator('statut')}</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {factures.map(facture => (
                            <tr key={facture.id} className="hover:bg-slate-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => onView(facture)}>{facture.numeroFacture}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{facture.clientDetails?.nom || 'N/A'} {facture.clientDetails?.prenom || ''}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{facture.dateEmission?.toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold text-right">{parseFloat(facture.totalAvecTva || 0).toFixed(2)} €</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(facture.statut)}`}>
                                        {facture.statut}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                                    <button onClick={() => onView(facture)} className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400" title="Voir Détails"><EyeIcon className="w-5 h-5"/></button>
                                    <button onClick={() => onEdit(facture)} className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 rounded-md hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400" title="Modifier"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => onDelete(facture.id)} className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

// Détail de la facture (pour affichage et impression)
const FactureDetail = ({ facture, onClose }) => {
    if (!facture) return null;

    const handlePrint = () => {
        const printableArea = document.querySelector('.printable-area');
        if (printableArea) {
            const printContents = printableArea.innerHTML;
            
            const iframe = document.createElement('iframe');
            iframe.style.height = '0';
            iframe.style.width = '0';
            iframe.style.position = 'absolute';
            iframe.style.border = '0';
            document.body.appendChild(iframe);
            
            const iframeDoc = iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write('<html><head><title>Facture</title>');
            iframeDoc.write('<script src="https://cdn.tailwindcss.com"></script>');
            iframeDoc.write('<style>@media print { @page { size: A4; margin: 20mm; } body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; font-family: "Inter", sans-serif; } .print-bg-slate-50 { background-color: #f8fafc !important; } .print-bg-slate-100 { background-color: #f1f5f9 !important; } .print-border { border: 1px solid #e2e8f0 !important; } .print-border-slate-300 { border-color: #cbd5e1 !important; } .print-text-xs { font-size: 0.75rem !important; } .print-text-sm { font-size: 0.875rem !important; } .print-text-base { font-size: 1rem !important; } .print-text-lg { font-size: 1.125rem !important; } .print-text-xl { font-size: 1.25rem !important; } .print-text-2xl { font-size: 1.5rem !important; } .print-text-3xl { font-size: 1.875rem !important; } }</style>');
            iframeDoc.write('</head><body>');
            iframeDoc.write(printContents);
            iframeDoc.write('</body></html>');
            iframeDoc.close();
            
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            setTimeout(() => {
                 document.body.removeChild(iframe);
            }, 500);

        } else {
            console.error("Erreur: Zone imprimable non trouvée.");
        }
    };
    
    const getStatusColorText = (status) => {
        switch (status) {
            case 'Payée': return 'text-green-600';
            case 'Partiellement Payée': return 'text-yellow-600';
            case 'Envoyée': return 'text-blue-600';
            case 'En Retard': return 'text-red-600';
            case 'Annulée': return 'text-slate-500';
            case 'Brouillon':
            default: return 'text-slate-600';
        }
    };
    
    const factureDateEmission = facture.dateEmission?.seconds ? new Date(facture.dateEmission.seconds * 1000) : new Date(facture.dateEmission);
    const factureDateEcheance = facture.dateEcheance?.seconds ? new Date(facture.dateEcheance.seconds * 1000) : (facture.dateEcheance ? new Date(facture.dateEcheance) : null);


    return (
        <>
            <div className="printable-area p-2">
                <div className="flex justify-between items-start mb-8 print-mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 print-text-3xl">FACTURE</h2>
                        <p className="text-slate-600 print-text-base">Numéro: <span className="font-semibold">{facture.numeroFacture}</span></p>
                        <p className={`text-lg font-semibold ${getStatusColorText(facture.statut)} print-text-lg`}>Statut: {facture.statut}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-slate-700 print-text-base">Votre Entreprise Radio</p>
                        <p className="text-sm text-slate-500 print-text-sm">123 Rue de la Radio, Ville, Pays</p>
                        <p className="text-sm text-slate-500 print-text-sm">Tel: +00 123 456 789</p>
                        <p className="text-sm text-slate-500 print-text-sm">Email: contact@radio.com</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print-grid print-grid-cols-2 print-gap-4 print-mb-8">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 print-bg-slate-50 print-p-4 print-rounded-md print-border">
                        <h3 className="font-semibold text-slate-700 mb-2 print-text-base">Client:</h3>
                        <p className="text-slate-600 print-text-base">{facture.clientDetails?.nom} {facture.clientDetails?.prenom}</p>
                        <p className="text-sm text-slate-500 print-text-sm">{facture.clientDetails?.tel}</p>
                        <p className="text-sm text-slate-500 print-text-sm">{facture.clientDetails?.email}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-right md:text-left print-bg-slate-50 print-p-4 print-rounded-md print-border">
                        <h3 className="font-semibold text-slate-700 mb-2 print-text-base">Dates:</h3>
                        <p className="text-slate-600 print-text-base">Émission: <span className="font-medium">{factureDateEmission.toLocaleDateString()}</span></p>
                        {factureDateEcheance && <p className="text-slate-600 print-text-base">Échéance: <span className="font-medium">{factureDateEcheance.toLocaleDateString()}</span></p>}
                    </div>
                </div>

                <div className="mb-8 print-mb-8">
                    <h3 className="text-lg font-semibold text-slate-700 mb-3 print-text-lg">Détail des prestations :</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-300 border border-slate-300 print-border print-border-slate-300">
                            <thead className="bg-slate-100 print-bg-slate-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider print-text-xs">Description</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider print-text-xs">Qté</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider print-text-xs">Prix Unit.</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider print-text-xs">Total Partiel</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200 print-border-slate-300">
                                {facture.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 whitespace-normal text-sm text-slate-600 print-text-sm">{item.description}</td>
                                        <td className="px-4 py-2 text-right whitespace-nowrap text-sm text-slate-600 print-text-sm">{item.quantite}</td>
                                        <td className="px-4 py-2 text-right whitespace-nowrap text-sm text-slate-600 print-text-sm">{parseFloat(item.prixUnitaire || 0).toFixed(2)} €</td>
                                        <td className="px-4 py-2 text-right whitespace-nowrap text-sm text-slate-600 font-medium print-text-sm">{(parseFloat(item.quantite) * parseFloat(item.prixUnitaire) || 0).toFixed(2)} €</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="flex justify-end mb-8 print-mb-8">
                    <div className="w-full md:w-1/2 lg:w-2/5 space-y-2">
                        <div className="flex justify-between text-slate-600 print-text-base">
                            <span>Sous-total:</span>
                            <span className="font-medium">{parseFloat(facture.sousTotal || 0).toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-slate-600 print-text-base">
                            <span>TVA ({facture.tvaPourcentage}%):</span>
                            <span className="font-medium">{parseFloat(facture.montantTva || 0).toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-slate-800 pt-2 border-t border-slate-300 print-text-xl print-border-slate-300">
                            <span>TOTAL:</span>
                            <span>{parseFloat(facture.totalAvecTva || 0).toFixed(2)} €</span>
                        </div>
                         <div className="flex justify-between text-slate-600 print-text-base">
                            <span>Montant Payé:</span>
                            <span className="font-medium text-green-600">{parseFloat(facture.montantPaye || 0).toFixed(2)} €</span>
                        </div>
                        <div className={`flex justify-between text-lg font-semibold ${parseFloat(facture.soldeDu || 0) > 0 ? 'text-red-600' : 'text-green-600'} print-text-lg`}>
                            <span>SOLDE DÛ:</span>
                            <span>{parseFloat(facture.soldeDu || 0).toFixed(2)} €</span>
                        </div>
                    </div>
                </div>

                {(facture.responsableDiffusion || facture.planAbonnementDetails || facture.notes) && (
                    <div className="mb-8 print-mb-8 border-t border-slate-200 pt-4 print-border-slate-300">
                        {facture.responsableDiffusion && <p className="text-sm text-slate-500 print-text-sm"><strong>Responsable de diffusion:</strong> {facture.responsableDiffusion}</p>}
                        {facture.planAbonnementDetails && <p className="text-sm text-slate-500 print-text-sm mt-1"><strong>Plan d'abonnement:</strong> {facture.planAbonnementDetails}</p>}
                        {facture.notes && (
                            <div className="mt-4 print-mt-4">
                                <h4 className="font-semibold text-slate-700 mb-1 print-text-base">Notes:</h4>
                                <p className="text-sm text-slate-500 whitespace-pre-wrap print-text-sm">{facture.notes}</p>
                            </div>
                        )}
                    </div>
                )}
                
                 <div className="text-center text-xs text-slate-400 pt-6 border-t border-slate-200 print-mt-6 print-border-slate-300">
                    Merci de votre confiance ! Conditions de paiement : 30 jours nets.
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200 no-print">
                <button 
                    onClick={onClose}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out flex items-center"
                >
                   <XMarkIcon className="w-5 h-5 mr-2"/> Fermer
                </button>
                <button 
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out flex items-center"
                >
                    <PrinterIcon className="w-5 h-5 mr-2"/> Imprimer la Facture
                </button>
            </div>
        </>
    );
};


// Composant principal pour la gestion des factures
const GestionFacturation = ({ clients, communiquesEmissions, currentUserId }) => {
    const [facturesBrutes, setFacturesBrutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentFacture, setCurrentFacture] = useState(null);
    const [error, setError] = useState(null);

    const [filterText, setFilterText] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'dateEmission', direction: 'descending' });


    const facturesCollectionPath = useMemo(() => {
        if (!currentUserId) return null;
        return `artifacts/${appId}/users/${currentUserId}/factures`;
    }, [currentUserId]);


    useEffect(() => {
        if (!facturesCollectionPath) {
            setIsLoading(false);
            setFacturesBrutes([]);
            return () => {};
        }
        
        setIsLoading(true);
        setError(null);
        
        const facturesRef = collection(db, facturesCollectionPath);
        const unsubscribe = onSnapshot(facturesRef, 
            (snapshot) => {
                const facturesData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return { 
                        id: doc.id, 
                        ...data,
                        dateEmission: data.dateEmission?.seconds ? new Date(data.dateEmission.seconds * 1000) : (data.dateEmission ? new Date(data.dateEmission) : null),
                        dateEcheance: data.dateEcheance?.seconds ? new Date(data.dateEcheance.seconds * 1000) : (data.dateEcheance ? new Date(data.dateEcheance) : null),
                    };
                });
                setFacturesBrutes(facturesData);
                setIsLoading(false);
            },
            (err) => {
                console.error("GestionFacturation: Erreur de récupération des factures: ", err);
                setError("Erreur lors de la récupération des factures. Détails: " + err.message);
                setIsLoading(false);
            }
        );
        return () => unsubscribe();
    }, [facturesCollectionPath]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedFactures = useMemo(() => {
        let sortableFactures = [...facturesBrutes];

        if (filterText) {
            sortableFactures = sortableFactures.filter(facture =>
                facture.numeroFacture?.toLowerCase().includes(filterText.toLowerCase()) ||
                (facture.clientDetails?.nom && facture.clientDetails.nom.toLowerCase().includes(filterText.toLowerCase())) ||
                (facture.clientDetails?.prenom && facture.clientDetails.prenom.toLowerCase().includes(filterText.toLowerCase()))
            );
        }
        if (filterStatus) {
            sortableFactures = sortableFactures.filter(facture => facture.statut === filterStatus);
        }

        if (sortConfig.key !== null) {
            sortableFactures.sort((a, b) => {
                const getNestedValue = (obj, path) => path.split('.').reduce((value, key) => (value && typeof value === 'object' && value[key] !== undefined) ? value[key] : undefined, obj);

                let valA = getNestedValue(a, sortConfig.key);
                let valB = getNestedValue(b, sortConfig.key);
                
                if (valA instanceof Date && valB instanceof Date) {
                     return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
                }

                if (valA === undefined || valA === null) return sortConfig.direction === 'ascending' ? 1 : -1;
                if (valB === undefined || valB === null) return sortConfig.direction === 'ascending' ? -1 : 1;

                if (typeof valA === 'number' && typeof valB === 'number') {
                    return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
                }
                
                const strA = String(valA).toLowerCase();
                const strB = String(valB).toLowerCase();

                if (strA < strB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (strA > strB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableFactures;
    }, [facturesBrutes, filterText, filterStatus, sortConfig]);


    const handleOpenFormModal = (facture = null) => {
        setCurrentFacture(facture);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setCurrentFacture(null);
    };

    const handleOpenDetailModal = (facture) => {
        setCurrentFacture(facture);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setCurrentFacture(null);
    };

    const handleSaveFacture = async (factureData) => {
        if (!facturesCollectionPath) {
            setError("Impossible de sauvegarder : chemin de collection non défini (ID utilisateur manquant ?).");
            return;
        }
        setError(null);
        try {
            const dataToSave = {
                ...factureData,
                dateEmission: new Date(factureData.dateEmission),
                dateEcheance: factureData.dateEcheance ? new Date(factureData.dateEcheance) : null,
                items: factureData.items.map(item => ({
                    ...item,
                    quantite: parseFloat(item.quantite) || 0,
                    prixUnitaire: parseFloat(item.prixUnitaire) || 0,
                    type: item.type || 'Autre',
                })),
                tvaPourcentage: parseFloat(factureData.tvaPourcentage) || 0,
                montantPaye: parseFloat(factureData.montantPaye) || 0,
            };

            if (dataToSave.id) {
                const factureRef = doc(db, facturesCollectionPath, dataToSave.id);
                await updateDoc(factureRef, dataToSave);
            } else { 
                const { id, ...finalData } = dataToSave;
                await addDoc(collection(db, facturesCollectionPath), finalData);
            }
            handleCloseFormModal();
        } catch (err) {
            console.error("GestionFacturation: Erreur lors de la sauvegarde de la facture: ", err);
            setError("Erreur lors de la sauvegarde de la facture. Détails: " + err.message + (err.details ? ` (${err.details})` : ''));
        }
    };

    const handleDeleteFacture = async (factureId) => {
        if (!facturesCollectionPath) {
            setError("Impossible de supprimer : chemin de collection non défini.");
            return;
        }
        setError(null);
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.")) {
            try {
                const factureRef = doc(db, facturesCollectionPath, factureId);
                await deleteDoc(factureRef);
            } catch (err) {
                console.error("GestionFacturation: Erreur lors de la suppression de la facture: ", err);
                setError("Erreur lors de la suppression de la facture. Détails: " + err.message);
            }
        }
    };
    
    if (!currentUserId) {
         return (
            <div className="p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Gestion des Factures</h2>
                <p className="text-center text-slate-500 py-8">Veuillez vous connecter pour gérer les factures.</p>
                 {error && <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>}
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-4 sm:mb-0">Gestion des Factures</h2>
                <button
                    onClick={() => handleOpenFormModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    <PlusIcon className="w-5 h-5 mr-2" /> Nouvelle Facture
                </button>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md relative mb-6 shadow" role="alert">
                <strong className="font-bold">Erreur: </strong>
                <span className="block sm:inline">{error}</span>
                 <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <XMarkIcon className="w-5 h-5 text-red-700"/>
                </button>
            </div>}

            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md">
                    <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="ml-4 text-slate-600 text-lg mt-4">Chargement des factures...</p>
                </div>
            ) : (
                <FactureList
                    factures={filteredAndSortedFactures}
                    onEdit={handleOpenFormModal}
                    onDelete={handleDeleteFacture}
                    onView={handleOpenDetailModal}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    filterText={filterText}
                    setFilterText={setFilterText}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                />
            )}

            <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={currentFacture?.id ? "Modifier la Facture" : "Créer une Nouvelle Facture"}>
                <FactureForm
                    initialFacture={currentFacture}
                    onSave={handleSaveFacture}
                    onCancel={handleCloseFormModal}
                    clients={clients} // clientsData viendra de App
                    communiquesEmissions={communiquesEmissions} // Ceci est encore la donnée statique
                />
            </Modal>

            <Modal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} title="Détail de la Facture" size="3xl">
                {currentFacture && <FactureDetail facture={currentFacture} onClose={handleCloseDetailModal} />}
            </Modal>
        </div>
    );
};

// Section Statistiques Financières
const SectionStatistiques = ({ currentUserId, clients }) => {
    const [factures, setFactures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterPeriode, setFilterPeriode] = useState('all');

    const facturesCollectionPath = useMemo(() => {
        if (!currentUserId) return null;
        return `artifacts/${appId}/users/${currentUserId}/factures`;
    }, [currentUserId]);

    useEffect(() => {
        if (!facturesCollectionPath) {
            setIsLoading(false);
            setFactures([]);
            return () => {};
        }
        setIsLoading(true);
        setError(null);
        const facturesRef = collection(db, facturesCollectionPath);
        const unsubscribe = onSnapshot(facturesRef,
            (snapshot) => {
                const facturesData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        dateEmission: data.dateEmission?.seconds ? new Date(data.dateEmission.seconds * 1000) : new Date(data.dateEmission),
                        totalAvecTva: parseFloat(data.totalAvecTva) || 0,
                        montantPaye: parseFloat(data.montantPaye) || 0,
                        items: Array.isArray(data.items) ? data.items.map(item => ({
                            ...item,
                            prixUnitaire: parseFloat(item.prixUnitaire) || 0,
                            quantite: parseFloat(item.quantite) || 0,
                        })) : [],
                    };
                });
                setFactures(facturesData);
                setIsLoading(false);
            },
            (err) => {
                console.error("SectionStatistiques: Erreur de récupération des factures: ", err);
                setError("Erreur lors de la récupération des statistiques de factures.");
                setIsLoading(false);
            }
        );
        return () => unsubscribe();
    }, [facturesCollectionPath]);

    const facturesFiltrees = useMemo(() => {
        if (filterPeriode === 'all') return factures;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return factures.filter(f => {
            const dateEmission = f.dateEmission;
            if (!dateEmission || !(dateEmission instanceof Date)) return false; 
            if (filterPeriode === 'currentMonth') {
                return dateEmission.getMonth() === currentMonth && dateEmission.getFullYear() === currentYear;
            }
            if (filterPeriode === 'currentYear') {
                return dateEmission.getFullYear() === currentYear;
            }
            return true;
        });
    }, [factures, filterPeriode]);


    const stats = useMemo(() => {
        const data = {
            chiffreAffairesTotal: 0,
            nombreTotalFactures: facturesFiltrees.length,
            montantMoyenFacture: 0,
            totalDu: 0,
            repartitionStatuts: {},
            revenusParCategorie: {},
            topClients: [],
        };

        const facturesPayantes = facturesFiltrees.filter(f => f.statut === 'Payée' || f.statut === 'Partiellement Payée');
        
        facturesPayantes.forEach(f => {
            data.chiffreAffairesTotal += f.montantPaye;
        });

        facturesFiltrees.forEach(f => {
            if (f.statut !== 'Annulée' && f.statut !== 'Payée') {
                data.totalDu += (f.totalAvecTva - f.montantPaye);
            }
            data.repartitionStatuts[f.statut] = (data.repartitionStatuts[f.statut] || 0) + 1;

            if (f.statut === 'Payée' || f.statut === 'Partiellement Payée') {
                 f.items.forEach(item => {
                    const categorie = item.type || 'Non spécifié';
                    const revenuItemBrut = item.quantite * item.prixUnitaire;
                    const proportionPaiement = f.totalAvecTva > 0 ? f.montantPaye / f.totalAvecTva : 0;
                    const revenuItemNet = revenuItemBrut * proportionPaiement;
                    data.revenusParCategorie[categorie] = (data.revenusParCategorie[categorie] || 0) + revenuItemNet;
                });
            }
        });
        
        const facturesValidesPourMoyenne = facturesFiltrees.filter(f => f.statut !== 'Annulée' && f.statut !== 'Brouillon');
        if (facturesValidesPourMoyenne.length > 0) {
            const totalMontantsFactures = facturesValidesPourMoyenne.reduce((sum, f) => sum + f.totalAvecTva, 0);
            data.montantMoyenFacture = totalMontantsFactures / facturesValidesPourMoyenne.length;
        }


        const revenusParClient = {};
        // S'assurer que 'clients' est un tableau avant d'appeler find
        const validClients = Array.isArray(clients) ? clients : [];
        facturesPayantes.forEach(f => {
            if (f.clientId) {
                revenusParClient[f.clientId] = (revenusParClient[f.clientId] || 0) + f.montantPaye;
            }
        });
        
        data.topClients = Object.entries(revenusParClient)
            .map(([clientId, revenu]) => {
                const clientInfo = validClients.find(c => c.id === clientId);
                return {
                    nomClient: clientInfo ? `${clientInfo.nom} ${clientInfo.prenom}` : `Client ID: ${clientId.substring(0,8)}...`,
                    revenu: revenu
                };
            })
            .sort((a, b) => b.revenu - a.revenu)
            .slice(0, 5);

        return data;
    }, [facturesFiltrees, clients]);

    const StatCard = ({ title, value, icon, unit = '', color = 'blue' }) => {
        const colors = {
            blue: 'border-blue-500 text-blue-600',
            green: 'border-green-500 text-green-600',
            yellow: 'border-yellow-500 text-yellow-600',
            red: 'border-red-500 text-red-600',
            purple: 'border-purple-500 text-purple-600',
        };
        return (
            <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${colors[color]} hover:shadow-xl transition-shadow duration-300`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                        <p className="text-3xl font-bold mt-1">{typeof value === 'number' ? value.toFixed(2) : value} {unit}</p>
                    </div>
                    {icon && <div className={`p-3 bg-${color}-100 rounded-full`}>{icon}</div>}
                </div>
            </div>
        );
    };
    
    const ProgressBar = ({ label, value, total, color = "blue" }) => {
        const percentage = total > 0 ? (value / total) * 100 : 0;
        const colorClasses = {
            blue: "bg-blue-500",
            green: "bg-green-500",
            yellow: "bg-yellow-500",
            red: "bg-red-500",
            purple: "bg-purple-500",
            slate: "bg-slate-500",
        };

        return (
            <div className="mb-2">
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>{label} ({value})</span>
                    <span>{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className={`${colorClasses[color]} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        );
    };


    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md">
                <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="ml-4 text-slate-600 text-lg mt-4">Chargement des statistiques...</p>
            </div>
        );
    }

    if (error) {
        return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md shadow" role="alert"><p>{error}</p></div>;
    }
    
    const statutCouleurs = {
        "Brouillon": "slate",
        "Envoyée": "blue",
        "Payée": "green",
        "Partiellement Payée": "yellow",
        "Annulée": "red",
        "En Retard": "purple",
    };


    return (
        <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-4 sm:mb-0">Statistiques Financières</h2>
                <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-slate-500"/>
                    <select 
                        value={filterPeriode} 
                        onChange={(e) => setFilterPeriode(e.target.value)}
                        className="p-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Toutes les périodes</option>
                        <option value="currentMonth">Mois en cours</option>
                        <option value="currentYear">Année en cours</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Chiffre d'Affaires" value={stats.chiffreAffairesTotal} unit="€" icon={<BanknotesIcon className="w-7 h-7 text-green-500"/>} color="green"/>
                <StatCard title="Factures Émises" value={stats.nombreTotalFactures} icon={<ListBulletIcon className="w-7 h-7 text-blue-500"/>} color="blue"/>
                <StatCard title="Montant Moyen/Facture" value={stats.montantMoyenFacture} unit="€" icon={<DocumentChartBarIcon className="w-7 h-7 text-purple-500"/>} color="purple"/>
                <StatCard title="Total Dû" value={stats.totalDu < 0 ? 0 : stats.totalDu} unit="€" icon={<BanknotesIcon className="w-7 h-7 text-red-500"/>} color="red"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-slate-700 mb-4">Répartition des Factures par Statut</h3>
                    {Object.entries(stats.repartitionStatuts).length > 0 ? 
                        Object.entries(stats.repartitionStatuts).map(([statut, count]) => (
                            <ProgressBar 
                                key={statut} 
                                label={statut} 
                                value={count} 
                                total={stats.nombreTotalFactures} 
                                color={statutCouleurs[statut] || 'slate'}
                            />
                        )) : <p className="text-slate-500">Aucune facture à afficher pour cette période.</p>
                    }
                </div>

                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-slate-700 mb-4">Revenus par Catégorie de Communiqué</h3>
                    {Object.entries(stats.revenusParCategorie).length > 0 ?
                        Object.entries(stats.revenusParCategorie)
                            .sort(([,a],[,b]) => b-a)
                            .map(([categorie, revenu]) => (
                            <div key={categorie} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                                <span className="text-sm text-slate-600">{categorie}</span>
                                <span className="text-sm font-semibold text-green-600">{revenu.toFixed(2)} €</span>
                            </div>
                        )) : <p className="text-slate-500">Aucune donnée de revenu par catégorie pour cette période.</p>
                    }
                </div>

                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-slate-700 mb-4">Top 5 Clients</h3>
                    {stats.topClients.length > 0 ?
                        stats.topClients.map((client, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                                <span className="text-sm text-slate-600 truncate" title={client.nomClient}>{index + 1}. {client.nomClient}</span>
                                <span className="text-sm font-semibold text-blue-600">{client.revenu.toFixed(2)} €</span>
                            </div>
                        )) : <p className="text-slate-500">Aucune donnée client pour cette période.</p>
                    }
                </div>
            </div>
        </div>
    );
};

// Section Statistiques de Diffusion
const SectionStatistiquesDiffusion = ({ currentUserId, clients, communiquesEmissions }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [filterPeriode, setFilterPeriode] = useState('all');
    const [filterClientId, setFilterClientId] = useState('');
    const [filterCategorie, setFilterCategorie] = useState('');
    const [filterStatutDiffusion, setFilterStatutDiffusion] = useState('');

    const simulatedDiffusions = useMemo(() => {
        const today = new Date();
        const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
        const validClients = Array.isArray(clients) ? clients : [];


        return [
            { id: 'diff1', communiqueId: 'ce1', clientId: 'client1', dateProgrammation: oneWeekAgo, statutDiffusion: 'Diffusé', categorieCommunique: 'Spot Publicitaire', titreCommunique: 'Spot Pub "SuperNettoyant"' },
            { id: 'diff2', communiqueId: 'ce2', clientId: 'client2', dateProgrammation: oneMonthAgo, statutDiffusion: 'Diffusé', categorieCommunique: 'Avis de Décès', titreCommunique: 'Avis de Décès Famille Durand' },
            { id: 'diff3', communiqueId: 'ce3', clientId: 'client1', dateProgrammation: today, statutDiffusion: 'Programmé', categorieCommunique: 'Intérêt Général', titreCommunique: 'Campagne "Sécurité Routière"' },
            { id: 'diff4', communiqueId: 'ce4', clientId: 'client3', dateProgrammation: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), statutDiffusion: 'Programmé', categorieCommunique: 'Spot Publicitaire', titreCommunique: 'Annonce "Ouverture Magasin Bio"' },
            { id: 'diff5', communiqueId: 'ce1', clientId: 'client2', dateProgrammation: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), statutDiffusion: 'Diffusé', categorieCommunique: 'Spot Publicitaire', titreCommunique: 'Spot Pub "SuperNettoyant"' },
            { id: 'diff6', communiqueId: 'ce2', clientId: 'client1', dateProgrammation: nextWeek, statutDiffusion: 'Programmé', categorieCommunique: 'Avis de Décès', titreCommunique: 'Avis de Décès Famille Durand' },
            { id: 'diff7', communiqueId: 'ce4', clientId: 'client3', dateProgrammation: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), statutDiffusion: 'Annulé', categorieCommunique: 'Spot Publicitaire', titreCommunique: 'Annonce "Ouverture Magasin Bio"' },
             { id: 'diff8', communiqueId: 'ce1', clientId: 'client1', dateProgrammation: new Date(2024, 0, 15), statutDiffusion: 'Diffusé', categorieCommunique: 'Spot Publicitaire', titreCommunique: 'Spot Pub "SuperNettoyant" Jan' }, 
             { id: 'diff9', communiqueId: 'ce3', clientId: 'client2', dateProgrammation: new Date(2023, 11, 20), statutDiffusion: 'Diffusé', categorieCommunique: 'Intérêt Général', titreCommunique: 'Campagne "Sécurité Routière" Dec 2023' }, 
        ].map(d => {
            const clientInfo = validClients.find(c => c.id === d.clientId);
            return {
                 ...d,
                nomClient: clientInfo ? `${clientInfo.nom} ${clientInfo.prenom}` : 'Client Inconnu',
            }
        });
    }, [clients]);

    const diffusionsFiltrees = useMemo(() => {
        let filtered = [...simulatedDiffusions];
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        if (filterPeriode === 'currentMonth') {
            filtered = filtered.filter(d => d.dateProgrammation.getMonth() === currentMonth && d.dateProgrammation.getFullYear() === currentYear);
        } else if (filterPeriode === 'currentYear') {
            filtered = filtered.filter(d => d.dateProgrammation.getFullYear() === currentYear);
        }
        if (filterClientId) {
            filtered = filtered.filter(d => d.clientId === filterClientId);
        }
        if (filterCategorie) {
            filtered = filtered.filter(d => d.categorieCommunique === filterCategorie);
        }
        if (filterStatutDiffusion) {
            filtered = filtered.filter(d => d.statutDiffusion === filterStatutDiffusion);
        }
        return filtered;
    }, [simulatedDiffusions, filterPeriode, filterClientId, filterCategorie, filterStatutDiffusion]);

    const statsDiffusion = useMemo(() => {
        const data = {
            nombreTotalDiffusions: diffusionsFiltrees.length,
            repartitionParCategorie: {},
            repartitionParStatut: {},
            repartitionParClient: {},
        };

        diffusionsFiltrees.forEach(d => {
            data.repartitionParCategorie[d.categorieCommunique] = (data.repartitionParCategorie[d.categorieCommunique] || 0) + 1;
            data.repartitionParStatut[d.statutDiffusion] = (data.repartitionParStatut[d.statutDiffusion] || 0) + 1;
            data.repartitionParClient[d.nomClient] = (data.repartitionParClient[d.nomClient] || 0) + 1;
        });
        
        data.topClientsDiffusion = Object.entries(data.repartitionParClient)
            .sort(([,a],[,b]) => b-a)
            .slice(0,5)
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});


        return data;
    }, [diffusionsFiltrees]);
    
    const categoriesDisponibles = useMemo(() => Array.from(new Set(simulatedDiffusions.map(d => d.categorieCommunique))).sort(), [simulatedDiffusions]);
    const statutsDiffusionDisponibles = useMemo(() => Array.from(new Set(simulatedDiffusions.map(d => d.statutDiffusion))).sort(), [simulatedDiffusions]);
    const validClients = Array.isArray(clients) ? clients : [];


    const StatDisplayCard = ({ title, data, icon }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center text-slate-700 mb-3">
                {icon && React.cloneElement(icon, { className: "w-5 h-5 mr-2"})}
                <h3 className="text-xl font-semibold ">{title}</h3>
            </div>
            {Object.keys(data).length > 0 ? (
                <ul className="space-y-2">
                    {Object.entries(data)
                        .sort(([,a],[,b]) => b-a)
                        .map(([key, value]) => (
                        <li key={key} className="flex justify-between text-sm text-slate-600">
                            <span>{key}</span>
                            <span className="font-medium text-slate-800">{value}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-500 text-sm">Aucune donnée pour les filtres actuels.</p>
            )}
        </div>
    );


    if (isLoading) return <div className="flex justify-center items-center h-64"><ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" /> <span className="ml-3">Chargement...</span></div>;
    if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
    if (!currentUserId) return <div className="p-6 bg-white rounded-xl shadow-lg text-center text-slate-500">Veuillez vous connecter pour voir les statistiques de diffusion.</div>;


    return (
        <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Statistiques de Diffusion</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-white rounded-xl shadow">
                <SelectField label="Période" id="filterPeriodeDiffusion" value={filterPeriode} onChange={e => setFilterPeriode(e.target.value)}>
                    <option value="all">Toutes les périodes</option>
                    <option value="currentMonth">Mois en cours</option>
                    <option value="currentYear">Année en cours</option>
                </SelectField>
                <SelectField label="Client" id="filterClientDiffusion" value={filterClientId} onChange={e => setFilterClientId(e.target.value)}>
                    <option value="">Tous les clients</option>
                    {validClients.map(c => <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
                </SelectField>
                <SelectField label="Catégorie" id="filterCategorieDiffusion" value={filterCategorie} onChange={e => setFilterCategorie(e.target.value)}>
                    <option value="">Toutes les catégories</option>
                    {categoriesDisponibles.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </SelectField>
                <SelectField label="Statut de Diffusion" id="filterStatutDiffusion" value={filterStatutDiffusion} onChange={e => setFilterStatutDiffusion(e.target.value)}>
                    <option value="">Tous les statuts</option>
                    {statutsDiffusionDisponibles.map(stat => <option key={stat} value={stat}>{stat}</option>)}
                </SelectField>
            </div>

            <div className="mb-8">
                 <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-lg font-medium uppercase tracking-wider">Nombre Total de Diffusions</p>
                    <p className="text-5xl font-extrabold mt-2">{statsDiffusion.nombreTotalDiffusions}</p>
                    <p className="text-sm opacity-80">(selon les filtres appliqués)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatDisplayCard title="Diffusions par Catégorie" data={statsDiffusion.repartitionParCategorie} icon={<TagIcon />} />
                <StatDisplayCard title="Diffusions par Statut" data={statsDiffusion.repartitionParStatut} icon={<DocumentChartBarIcon />} />
                <StatDisplayCard title="Top Clients (par nbre de diffusions)" data={statsDiffusion.topClientsDiffusion} icon={<UsersIcon />} />
            </div>
        </div>
    );
};

// Section Planning de Diffusion
const SectionPlanning = ({ currentUserId, clients, communiquesEmissions }) => {
    const today = new Date();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filtres
    const [filterDateDebut, setFilterDateDebut] = useState(new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]);
    const [filterDateFin, setFilterDateFin] = useState(new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]);
    const [filterClientId, setFilterClientId] = useState('');
    const [filterCategorie, setFilterCategorie] = useState('');
    const [filterStatutDiffusion, setFilterStatutDiffusion] = useState('');
    const [filterResponsable, setFilterResponsable] = useState('');
    const validClients = Array.isArray(clients) ? clients : [];


    const getFormattedTime = (date) => {
        if (!date) return '--:--';
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };
    
    const simulatedPlanning = useMemo(() => {
        return [
            { id: 'plan1', communiqueId: 'ce1', clientId: 'client1', titre: 'Spot "SuperNettoyant"', dateProgrammation: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0), duree: '30s', statutDiffusion: 'Programmé', categorieCommunique: 'Spot Publicitaire', responsableDiffusion: 'Studio A' },
            { id: 'plan2', communiqueId: 'ce2', clientId: 'client2', titre: 'Avis Décès Durand', dateProgrammation: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30), duree: '1min', statutDiffusion: 'Programmé', categorieCommunique: 'Avis de Décès', responsableDiffusion: 'Service Annonces' },
            { id: 'plan3', communiqueId: 'ce3', clientId: 'client1', titre: 'Campagne "Sécurité Routière"', dateProgrammation: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0), duree: '45s', statutDiffusion: 'Programmé', categorieCommunique: 'Intérêt Général', responsableDiffusion: 'Rédaction' },
            { id: 'plan4', communiqueId: 'ce4', clientId: 'client3', titre: 'Annonce "Magasin Bio"', dateProgrammation: new Date(today.getFullYear(), today.getMonth(), today.getDate() +1, 11, 15), duree: '1m30s', statutDiffusion: 'Diffusé', categorieCommunique: 'Spot Publicitaire', responsableDiffusion: 'Studio B' },
            { id: 'plan5', communiqueId: 'ce1', clientId: 'client2', titre: 'Spot "SuperNettoyant" (R)', dateProgrammation: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0), duree: '30s', statutDiffusion: 'En cours', categorieCommunique: 'Spot Publicitaire', responsableDiffusion: 'Studio A' },
            { id: 'plan6', communiqueId: 'ce1', clientId: 'client1', titre: 'Spot "SuperNettoyant" (Soir)', dateProgrammation: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 45), duree: '30s', statutDiffusion: 'Annulé', categorieCommunique: 'Spot Publicitaire', responsableDiffusion: 'Studio A' },
            { id: 'plan7', communiqueId: 'ce2', clientId: 'client3', titre: 'Avis Décès Famille Martin', dateProgrammation: new Date(today.getFullYear(), today.getMonth() -1, 15, 10, 0), duree: '1min', statutDiffusion: 'Diffusé', categorieCommunique: 'Avis de Décès', responsableDiffusion: 'Service Annonces' },
            { id: 'plan8', communiqueId: 'ce4', clientId: 'client1', titre: 'Pub "Nouveau Restaurant"', dateProgrammation: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 12, 0), duree: '1min', statutDiffusion: 'Programmé', categorieCommunique: 'Spot Publicitaire', responsableDiffusion: 'Studio B' },
        ].map(p => {
            const clientInfo = validClients.find(c => c.id === p.clientId);
            return {
                ...p,
                nomClient: clientInfo ? `${clientInfo.nom} ${clientInfo.prenom}` : 'N/A',
            }
        });
    }, [validClients]);

    const planningFiltre = useMemo(() => {
        let filtered = [...simulatedPlanning];
        const dateDebut = filterDateDebut ? new Date(filterDateDebut + "T00:00:00") : null;
        const dateFin = filterDateFin ? new Date(filterDateFin + "T23:59:59") : null;

        if (dateDebut) filtered = filtered.filter(p => p.dateProgrammation >= dateDebut);
        if (dateFin) filtered = filtered.filter(p => p.dateProgrammation <= dateFin);
        if (filterClientId) filtered = filtered.filter(p => p.clientId === filterClientId);
        if (filterCategorie) filtered = filtered.filter(p => p.categorieCommunique === filterCategorie);
        if (filterStatutDiffusion) filtered = filtered.filter(p => p.statutDiffusion === filterStatutDiffusion);
        if (filterResponsable) filtered = filtered.filter(p => p.responsableDiffusion === filterResponsable);
        
        return filtered.sort((a,b) => a.dateProgrammation - b.dateProgrammation);

    }, [simulatedPlanning, filterDateDebut, filterDateFin, filterClientId, filterCategorie, filterStatutDiffusion, filterResponsable]);

    const planningGroupeParJour = useMemo(() => {
        return planningFiltre.reduce((acc, item) => {
            const dateStr = item.dateProgrammation.toLocaleDateString('fr-CA'); 
            if (!acc[dateStr]) {
                acc[dateStr] = [];
            }
            acc[dateStr].push(item);
            return acc;
        }, {});
    }, [planningFiltre]);

    const setPeriodePredefinie = (type) => {
        const today = new Date();
        let debut, fin;
        if (type === 'today') {
            debut = fin = today;
        } else if (type === 'week') {
            const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))); 
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6); 
            debut = firstDayOfWeek;
            fin = lastDayOfWeek;
        } else if (type === 'month') {
            debut = new Date(today.getFullYear(), today.getMonth(), 1);
            fin = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        }
        setFilterDateDebut(debut.toISOString().split('T')[0]);
        setFilterDateFin(fin.toISOString().split('T')[0]);
    };
    
    const categoriesDisponibles = useMemo(() => Array.from(new Set(simulatedPlanning.map(d => d.categorieCommunique))).sort(), [simulatedPlanning]);
    const statutsDiffusionDisponibles = useMemo(() => Array.from(new Set(simulatedPlanning.map(d => d.statutDiffusion))).sort(), [simulatedPlanning]);
    const responsablesDisponibles = useMemo(() => Array.from(new Set(simulatedPlanning.map(d => d.responsableDiffusion))).sort(), [simulatedPlanning]);

    const handlePrintPlanning = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Planning de Diffusion</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>'); 
        printWindow.document.write(`
            <style>
                body { font-family: 'Inter', sans-serif; margin: 20px; }
                .planning-print-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .planning-print-table th, .planning-print-table td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; font-size: 0.875rem; }
                .planning-print-table th { background-color: #f1f5f9; font-weight: 600; }
                .planning-print-day-header { font-size: 1.125rem; font-weight: bold; margin-top: 20px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #cbd5e1;}
                @media print {
                    @page { size: A4 landscape; margin: 15mm; }
                    body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
                    .no-print-in-export { display: none !important; }
                }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h1 class="text-2xl font-bold mb-4">Planning de Diffusion</h1>');
        printWindow.document.write(`<p class="mb-2 text-sm text-slate-600">Période du ${new Date(filterDateDebut).toLocaleDateString('fr-FR')} au ${new Date(filterDateFin).toLocaleDateString('fr-FR')}</p>`);
        
        Object.entries(planningGroupeParJour).forEach(([date, items]) => {
            printWindow.document.write(`<h2 class="planning-print-day-header">${new Date(date + "T00:00:00").toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>`);
            printWindow.document.write('<table class="planning-print-table"><thead><tr>');
            printWindow.document.write('<th>Heure</th><th>Titre</th><th>Catégorie</th><th>Client</th><th>Durée</th><th>Responsable</th><th>Statut</th>');
            printWindow.document.write('</tr></thead><tbody>');
            items.forEach(item => {
                printWindow.document.write('<tr>');
                printWindow.document.write(`<td>${getFormattedTime(item.dateProgrammation)}</td>`);
                printWindow.document.write(`<td>${item.titre}</td>`);
                printWindow.document.write(`<td>${item.categorieCommunique}</td>`);
                printWindow.document.write(`<td>${item.nomClient}</td>`);
                printWindow.document.write(`<td>${item.duree}</td>`);
                printWindow.document.write(`<td>${item.responsableDiffusion}</td>`);
                printWindow.document.write(`<td>${item.statutDiffusion}</td>`);
                printWindow.document.write('</tr>');
            });
            printWindow.document.write('</tbody></table>');
        });

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 500); 
    };
    
    const getStatutColorClass = (statut) => {
        switch (statut) {
            case 'Programmé': return 'bg-blue-100 text-blue-700';
            case 'Diffusé': return 'bg-green-100 text-green-700';
            case 'Annulé': return 'bg-red-100 text-red-700';
            case 'En cours': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };


    if (isLoading) return <div className="flex justify-center items-center h-64"><ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" /> <span className="ml-3">Chargement du planning...</span></div>;
    if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
    if (!currentUserId) return <div className="p-6 bg-white rounded-xl shadow-lg text-center text-slate-500">Veuillez vous connecter pour voir le planning.</div>;

    return (
        <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800 mb-4 sm:mb-0">Planning de Diffusion</h2>
                <button
                    onClick={handlePrintPlanning}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-colors flex items-center"
                >
                    <PrinterIcon className="w-5 h-5 mr-2" /> Exporter en PDF
                </button>
            </div>

            {/* Filtres */}
            <div className="bg-white p-4 rounded-xl shadow mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                    <InputField label="Date de début" type="date" value={filterDateDebut} onChange={e => setFilterDateDebut(e.target.value)} />
                    <InputField label="Date de fin" type="date" value={filterDateFin} onChange={e => setFilterDateFin(e.target.value)} />
                    <SelectField label="Client" value={filterClientId} onChange={e => setFilterClientId(e.target.value)}>
                        <option value="">Tous les clients</option>
                        {validClients.map(c => <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
                    </SelectField>
                    <SelectField label="Catégorie" value={filterCategorie} onChange={e => setFilterCategorie(e.target.value)}>
                        <option value="">Toutes les catégories</option>
                        {categoriesDisponibles.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </SelectField>
                    <SelectField label="Statut Diffusion" value={filterStatutDiffusion} onChange={e => setFilterStatutDiffusion(e.target.value)}>
                        <option value="">Tous les statuts</option>
                        {statutsDiffusionDisponibles.map(stat => <option key={stat} value={stat}>{stat}</option>)}
                    </SelectField>
                     <SelectField label="Responsable" value={filterResponsable} onChange={e => setFilterResponsable(e.target.value)}>
                        <option value="">Tous les responsables</option>
                        {responsablesDisponibles.map(resp => <option key={resp} value={resp}>{resp}</option>)}
                    </SelectField>
                    <div className="lg:col-span-2 xl:col-span-2 flex flex-wrap gap-2 items-center justify-start pt-4">
                        <button onClick={() => setPeriodePredefinie('today')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm py-2 px-3 rounded-md transition-colors">Aujourd'hui</button>
                        <button onClick={() => setPeriodePredefinie('week')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm py-2 px-3 rounded-md transition-colors">Cette Semaine</button>
                        <button onClick={() => setPeriodePredefinie('month')} className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm py-2 px-3 rounded-md transition-colors">Ce Mois</button>
                    </div>
                </div>
            </div>

            {/* Affichage du Planning */}
            {Object.keys(planningGroupeParJour).length === 0 && (
                <p className="text-center text-slate-500 py-8 bg-white rounded-xl shadow">Aucune diffusion programmée pour les critères sélectionnés.</p>
            )}

            <div className="space-y-8">
                {Object.entries(planningGroupeParJour).map(([date, items]) => (
                    <div key={date} className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-200">
                            {new Date(date + "T00:00:00").toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        <div className="space-y-3">
                            {items.map(item => (
                                <div key={item.id} className="p-3 border border-slate-200 rounded-lg hover:shadow-md transition-shadow duration-150">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div className="mb-2 sm:mb-0">
                                            <span className="font-semibold text-blue-600 text-lg mr-3">
                                                <ClockIcon className="w-5 h-5 inline mr-1 mb-0.5"/>{getFormattedTime(item.dateProgrammation)}
                                            </span>
                                            <span className="font-medium text-slate-800">{item.titre}</span>
                                            <span className="text-xs text-slate-500 ml-2">({item.duree})</span>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatutColorClass(item.statutDiffusion)}`}>
                                            {item.statutDiffusion}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-sm text-slate-600 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1">
                                        <span><TagIcon className="w-4 h-4 inline mr-1 text-slate-400"/>Cat: {item.categorieCommunique}</span>
                                        <span><UsersIcon className="w-4 h-4 inline mr-1 text-slate-400"/>Client: {item.nomClient}</span>
                                        <span><AdjustmentsHorizontalIcon className="w-4 h-4 inline mr-1 text-slate-400"/>Resp: {item.responsableDiffusion}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ***** Section Gestion des Clients *****
const ClientForm = ({ initialClient, onSave, onCancel }) => {
    const [client, setClient] = useState({ nom: '', prenom: '', tel: '', email: '', adresse: '', notes: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialClient) {
            setClient(initialClient);
        } else {
            setClient({ nom: '', prenom: '', tel: '', email: '', adresse: '', notes: '' });
        }
        setErrors({});
    }, [initialClient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
    };

    const validate = () => {
        const newErrors = {};
        if (!client.nom.trim()) newErrors.nom = "Le nom est requis.";
        if (!client.prenom.trim()) newErrors.prenom = "Le prénom est requis.";
        if (!client.tel.trim()) newErrors.tel = "Le téléphone est requis.";
        else if (!/^\+?[0-9\s-()]*$/.test(client.tel)) newErrors.tel = "Format de téléphone invalide.";
        if (client.email.trim() && !/\S+@\S+\.\S+/.test(client.email)) newErrors.email = "Format d'email invalide.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(client);
        }
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
        if (!clientsCollectionPath) {
            setIsLoading(false);
            setClients([]);
            return () => {};
        }
        setIsLoading(true);
        const unsubscribe = onSnapshot(collection(db, clientsCollectionPath), 
            (snapshot) => {
                setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setIsLoading(false);
            }, 
            (err) => {
                console.error("Erreur de lecture des clients:", err);
                setError("Impossible de charger les clients.");
                setIsLoading(false);
            }
        );
        return () => unsubscribe();
    }, [clientsCollectionPath]);

    const handleSaveClient = async (clientData) => {
        if (!clientsCollectionPath) {
            setError("Chemin de collection non défini (ID utilisateur manquant ?).");
            return;
        }
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
            console.error("Erreur sauvegarde client:", err);
            setError("Échec de la sauvegarde du client.");
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (!clientsCollectionPath) {
             setError("Chemin de collection non défini.");
             return;
        }
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
            try {
                await deleteDoc(doc(db, clientsCollectionPath, clientId));
            } catch (err) {
                console.error("Erreur suppression client:", err);
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

// ***** Section Gestion des Diffusions *****
const DiffusionForm = ({ initialDiffusion, onSave, onCancel, clientsData, currentUserId }) => {
    const defaultState = {
        titre: '',
        categorie: 'Spot Publicitaire', // Default category
        prix: 0,
        clientId: '',
        responsableDiffusion: '',
        periodicite: 'Unique', // Unique, Par Jour, Par Mois
        nombreDiffusion: 1,
        descriptionAbonnement: '',
        // Ajout de champs pour les dates de début et fin de campagne/diffusion
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
                prix: initialDiffusion.prix || 0, // Assurer que prix est un nombre
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
        // ClientId peut être optionnel pour certaines diffusions (Intérêt Général)
        // if (!diffusion.clientId && diffusion.categorie !== 'Intérêt Général') newErrors.clientId = "Le client est requis pour ce type de diffusion.";
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


// Composant App principal
export default function App() {
    const [currentSection, setCurrentSection] = useState('clients'); // Default section
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [globalError, setGlobalError] = useState(null);

    // State for clients data fetched from Firestore, to be passed around
    const [clientsData, setClientsData] = useState([]);
    // State for diffusions data fetched from Firestore
    const [diffusionsData, setDiffusionsData] = useState([]);
    
    // Static data for communiques/emissions used in FactureForm, etc.
    // This will eventually be replaced by dynamic diffusionsData for more consistency.
    const [communiquesEmissionsStatic, setCommuniquesEmissionsStatic] = useState([
        { id: 'ce1', titre: 'Spot Pub "SuperNettoyant"', categorie: 'Spot Publicitaire', prix: 150, responsableDiffusion: 'Studio A', planAbonnementDetails: '5 diff/jour, 1 semaine', nombreDiffusionParJour: 5 },
        { id: 'ce2', titre: 'Avis de Décès Famille Durand', categorie: 'Avis de Décès', prix: 50, responsableDiffusion: 'Service Annonces', planAbonnementDetails: '3 diff/jour, 2 jours', nombreDiffusionParJour: 3 },
        { id: 'ce3', titre: 'Campagne "Sécurité Routière"', categorie: 'Intérêt Général', prix: 0, responsableDiffusion: 'Rédaction', planAbonnementDetails: 'Selon programmation', nombreDiffusionParJour: 2 },
        { id: 'ce4', titre: 'Annonce "Ouverture Magasin Bio"', categorie: 'Spot Publicitaire', prix: 120, responsableDiffusion: 'Studio B', planAbonnementDetails: '10 diff/jour, 3 jours', nombreDiffusionParJour: 10 },
    ]);
    
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                if (token) {
                    await signInWithCustomToken(auth, token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("App: Erreur lors de l'authentification initiale:", error);
                setGlobalError(`Erreur d'authentification: ${error.message}. Vérifiez la configuration Firebase et les règles de sécurité.`);
            }
        };

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid);
            } else {
                setCurrentUserId(null);
                 // Reset data if user logs out
                setClientsData([]);
                setDiffusionsData([]);
            }
            setIsAuthReady(true);
        });
        
        if (!auth.currentUser) {
          initializeAuth();
        } else {
          setCurrentUserId(auth.currentUser.uid);
          setIsAuthReady(true);
        }
        
        return () => unsubscribeAuth();
    }, []);

    // Fetch clients data when user is authenticated
    useEffect(() => {
        if (!currentUserId) {
            setClientsData([]); // Clear data if no user
            return () => {};
        }
        const clientsCollectionPath = `artifacts/${appId}/users/${currentUserId}/clients`;
        const unsubscribeClients = onSnapshot(collection(db, clientsCollectionPath), (snapshot) => {
            setClientsData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
            console.error("Erreur de chargement des clients (App):", error);
            setGlobalError("Impossible de charger les données des clients.");
        });
        return () => unsubscribeClients();
    }, [currentUserId]);

    // Fetch diffusions data when user is authenticated
     useEffect(() => {
        if (!currentUserId) {
            setDiffusionsData([]);
            return () => {};
        }
        const diffusionsCollectionPath = `artifacts/${appId}/users/${currentUserId}/diffusions`;
        const unsubscribeDiffusions = onSnapshot(collection(db, diffusionsCollectionPath), (snapshot) => {
            setDiffusionsData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
            console.error("Erreur de chargement des diffusions (App):", error);
            setGlobalError("Impossible de charger les données des diffusions.");
        });
        return () => unsubscribeDiffusions();
    }, [currentUserId]);


    if (!isAuthReady) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
                <ArrowPathIcon className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                <p className="text-xl text-slate-700">Initialisation de l'application...</p>
            </div>
        );
    }
    
    if (globalError && !currentUserId) { // Show global error only if critical and no user (e.g. auth failed)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
                <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg text-center">
                    <h2 className="text-2xl font-bold text-red-700 mb-4">Erreur Critique de l'Application</h2>
                    <p className="text-red-600 bg-red-100 p-4 rounded-md mb-6 whitespace-pre-wrap">{globalError}</p>
                    <p className="text-sm text-slate-600">Veuillez vérifier votre configuration Firebase, les règles de sécurité Firestore, et que les services Firebase sont correctement activés pour votre projet.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                    >
                        Recharger l'application
                    </button>
                </div>
            </div>
        );
    }

    const NavLink = ({ sectionName, currentSection, setCurrentSection, children, icon }) => (
        <button
            onClick={() => setCurrentSection(sectionName)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                        ${currentSection === sectionName 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-slate-600 hover:bg-blue-100 hover:text-blue-700'
                        }`}
        >
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
                            <svg className="h-8 w-auto text-blue-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.625 3.248A1.125 1.125 0 019 15.375V8.625c0-.828.934-1.335 1.65-1.007l5.624 3.248z" clipRule="evenodd" /></svg>
                            <span className="ml-3 font-bold text-xl text-slate-800">Radio Dashboard Pro</span>
                        </div>
                         <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                             <NavLink sectionName="clients" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<UserGroupIcon/>}>
                                Clients
                            </NavLink>
                             <NavLink sectionName="diffusions" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<MegaphoneIcon/>}>
                                Diffusions
                            </NavLink>
                            <NavLink sectionName="facturation" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<ListBulletIcon/>}>
                                Facturation
                            </NavLink>
                             <NavLink sectionName="planning" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<CalendarDaysIcon/>}>
                                Planning
                            </NavLink>
                            <NavLink sectionName="statistiques_financieres" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<ChartPieIcon/>}>
                                Stats Financières
                            </NavLink>
                             <NavLink sectionName="statistiques_diffusion" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<SpeakerWaveIcon/>}>
                                Stats Diffusion
                            </NavLink>
                        </nav>
                        <div className="text-sm text-slate-500">
                           {currentUserId ? <span title={currentUserId}>ID: {currentUserId.substring(0,8)}...</span> : "Non connecté"}
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                 {globalError && currentUserId && /* Show non-critical errors within the app layout */
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md relative mb-6 shadow" role="alert">
                        <strong className="font-bold">Erreur: </strong>
                        <span className="block sm:inline">{globalError}</span>
                        <button onClick={() => setGlobalError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <XMarkIcon className="w-5 h-5 text-red-700"/>
                        </button>
                    </div>
                }
                {currentSection === 'clients' && (
                    <SectionGestionClients currentUserId={currentUserId} />
                )}
                {currentSection === 'diffusions' && (
                    <SectionGestionDiffusions currentUserId={currentUserId} clientsData={clientsData} />
                )}
                {currentSection === 'facturation' && (
                    <GestionFacturation 
                        clients={clientsData} // Utiliser les clients de Firestore
                        communiquesEmissions={diffusionsData.length > 0 ? diffusionsData : communiquesEmissionsStatic} // Utiliser les diffusions dynamiques si disponibles, sinon fallback
                        currentUserId={currentUserId} 
                    />
                )}
                {currentSection === 'statistiques_financieres' && (
                    <SectionStatistiques 
                        currentUserId={currentUserId}
                        clients={clientsData} // Utiliser les clients de Firestore
                    />
                )}
                 {currentSection === 'statistiques_diffusion' && (
                    <SectionStatistiquesDiffusion 
                        currentUserId={currentUserId}
                        clients={clientsData} // Utiliser les clients de Firestore
                        communiquesEmissions={diffusionsData.length > 0 ? diffusionsData : communiquesEmissionsStatic} // Utiliser les diffusions dynamiques
                    />
                )}
                {currentSection === 'planning' && (
                    <SectionPlanning
                        currentUserId={currentUserId}
                        clients={clientsData} // Utiliser les clients de Firestore
                        communiquesEmissions={diffusionsData.length > 0 ? diffusionsData : communiquesEmissionsStatic} // Utiliser les diffusions dynamiques
                    />
                )}
            </main>
            <footer className="text-center py-6 text-sm text-slate-500 border-t border-slate-200 bg-white no-print mt-12">
                © {new Date().getFullYear()} Votre Entreprise Radio. Tous droits réservés. App ID: {appId}
            </footer>
        </div>
    );
}

