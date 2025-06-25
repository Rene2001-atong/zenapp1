import React,{ useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth, appId } from './firebase/config';

// Assurez-vous d'avoir créé ces fichiers et d'y avoir mis le code correspondant
import SectionGestionClients from './sections/sectionClient';
import SectionGestionDiffusions from './sections/sectionDiffusion';
import GestionFacturation from './sections/SectionFacturation';
import SectionPlanning from './sections/sectionPlanning';
import SectionStatistiques from './sections/sectionStatistiques';
import SectionStatistiquesDiffusion from './sections/sectionStatsDiffusion';
import SectionGestionEquipesTaches from './sections/sectionTasksTeams';

import { ArrowPathIcon, ClipboardDocumentListIcon, UserGroupIcon, MegaphoneIcon, ListBulletIcon, CalendarDaysIcon, ChartPieIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

export default function App() {
    const [currentSection, setCurrentSection] = useState('clients'); 
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [globalError, setGlobalError] = useState(null);
    
    // États pour les données partagées récupérées depuis Firestore
    const [clientsData, setClientsData] = useState([]);
    const [diffusionsData, setDiffusionsData] = useState([]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUserId(user.uid);
            } else {
                try {
                    await signInAnonymously(auth);
                } catch (error) {
                    console.error("Anonymous sign-in failed:", error);
                    setGlobalError("L'authentification a échoué. Veuillez vérifier la configuration de Firebase.");
                }
            }
            setIsAuthReady(true);
        });
        return () => unsubscribeAuth();
    }, []);

    // Fetch des données des clients
    useEffect(() => {
        if (!currentUserId) { setClientsData([]); return; }
        const path = `artifacts/${appId}/users/${currentUserId}/clients`;
        const unsubscribe = onSnapshot(collection(db, path), 
            (snapshot) => setClientsData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            (error) => { console.error("Erreur chargement clients (App):", error); setGlobalError("Impossible de charger les données des clients."); }
        );
        return () => unsubscribe();
    }, [currentUserId]);

    // Fetch des données des diffusions
    useEffect(() => {
        if (!currentUserId) { setDiffusionsData([]); return; }
        const path = `artifacts/${appId}/users/${currentUserId}/diffusions`;
        const unsubscribe = onSnapshot(collection(db, path),
            (snapshot) => setDiffusionsData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            (error) => { console.error("Erreur chargement diffusions (App):", error); setGlobalError("Impossible de charger les diffusions."); }
        );
        return () => unsubscribe();
    }, [currentUserId]);


    const NavLink = ({ sectionName, children, icon }) => (
        <button
            onClick={() => setCurrentSection(sectionName)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${currentSection === sectionName ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-100 hover:text-blue-700'}`}
        >
            {icon && React.cloneElement(icon, { className: `w-5 h-5 mr-2`})}
            {children}
        </button>
    );

    if (!isAuthReady) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
                <ArrowPathIcon className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                <p className="text-xl text-slate-700">Initialisation...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container_nav mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                           <SpeakerWaveIcon className="h-8 w-auto text-blue-600"/>
                            <span className="ml-3 font-bold text-xl text-slate-800">Radio Dashboard</span>
                        </div>
                        <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                             <button className='nav_btn'> <NavLink sectionName="tasks_teams" currentSection={currentSection} setCurrentSection={setCurrentSection} icon={<ClipboardDocumentListIcon/>}>Équipes & Tâches</NavLink></button>
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
                 {globalError && (
                     <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md relative mb-6 shadow" role="alert">
                        <strong className="font-bold">Erreur: </strong>
                        <span className="block sm:inline">{globalError}</span>
                        <button onClick={() => setGlobalError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3"><XMarkIcon className="w-5 h-5 text-red-700"/></button>
                    </div>
                )}
                
                {/* Rendu conditionnel des sections */}
                {currentSection === 'tasks_teams' && <SectionGestionEquipesTaches currentUserId={currentUserId} />}
                {currentSection === 'clients' && <SectionGestionClients currentUserId={currentUserId} />}
                {currentSection === 'diffusions' && <SectionGestionDiffusions currentUserId={currentUserId} clientsData={clientsData} />}
                {currentSection === 'facturation' && <GestionFacturation clients={clientsData} communiquesEmissions={diffusionsData} currentUserId={currentUserId} /> }
                {currentSection === 'planning' && <SectionPlanning currentUserId={currentUserId} clients={clientsData} diffusionsData={diffusionsData} />}
                {currentSection === 'statistiques_financieres' && <SectionStatistiques currentUserId={currentUserId} clients={clientsData} />}
                {currentSection === 'statistiques_diffusion' && <SectionStatistiquesDiffusion currentUserId={currentUserId} clients={clientsData} communiquesEmissions={diffusionsData} />}
            </main>
        </div>
    );
}
