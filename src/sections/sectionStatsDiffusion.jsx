import React, { useState, useMemo } from 'react';
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Section Statistiques de Diffusion

// const SectionStatistiquesDiffusion = ({ currentUserId, clients, communiquesEmissions }) 
import { ArrowPathIcon,TagIcon, DocumentChartBarIcon, UsersIcon}  from '@heroicons/react/24/outline';

// composants modaux
const SelectField = ({ label, id, error, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select id={id} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}>
            {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);








export default function SectionStatistiquesDiffusion  ({ currentUserId, clients }) {
    const [isLoading] = useState(false);
    const [error] = useState(null);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState(null);
    
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