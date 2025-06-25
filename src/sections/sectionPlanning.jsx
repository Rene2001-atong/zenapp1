// import React, { useState, useMemo } from 'react';
// import React, { useState, useEffect, useMemo } from 'react';
import React, { useState, useMemo } from 'react';
// import { db, auth, appId } from '../firebase/config'; // Assurez-vous que le chemin est correct
// import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ArrowPathIcon, ClockIcon, TagIcon, UsersIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
//  import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowPathIcon,PrinterIcon} from '@heroicons/react/24/outline';
 import { PrinterIcon} from '@heroicons/react/24/outline';
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import communiquesEmissions from '';


// composants del'ui ux
const InputField = ({ label, id, error, type = "text", ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={id} type={type} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}`} />
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



// Section Planning de Diffusion
//  const SectionPlanning = ({ currentUserId, clients, communiquesEmissions })
 export default function SectionPlanning ({ currentUserId, clients  }) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const today = new Date();
    // const [isLoading, setIsLoading] = useState(false);
    const [isLoading ] = useState(false);
    // const [error, setError] = useState(null);
    const [error] = useState(null);

    // Filtres
    const [filterDateDebut, setFilterDateDebut] = useState(new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]);
    const [filterDateFin, setFilterDateFin] = useState(new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]);
    const [filterClientId, setFilterClientId] = useState('');
    const [filterCategorie, setFilterCategorie] = useState('');
    const [filterStatutDiffusion, setFilterStatutDiffusion] = useState('');
    const [filterResponsable, setFilterResponsable] = useState('');
    // const validClients = Array.isArray(clients) ? clients : [today.getDate()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const validClients = Array.isArray(clients) ? clients : [today.getDate()];


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
    }, [today, validClients]);

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
