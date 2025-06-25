// // import React, { useState, useEffect,  useMemo } from 'react';
// // import { appId, firebaseConfig} from '../firebase/config';
// // import { initializeApp } from 'firebase/app';
// // import { 
// //     // auth,
// //     // getFirestore
  
// //     collection, 
// //     // addDoc, 
// //     // doc, 
// //     // updateDoc, 
// //     // deleteDoc, 
// //     onSnapshot 

// // } from 'firebase/firestore';

// // // Initialisation de Firebase

// // const app = initializeApp(firebaseConfig);
// // const db = getFirestore(app);
// // // const auth = getAuth(app);

// // // import React, { useState, useEffect, useCallback, useMemo } from 'react';

// // // Section Statistiques Financières
// // export default  SectionStatistiques ({ currentUserId, clients }) 
// // {
// //     const [factures, setFactures] = useState([]);
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     // const [filterPeriode, setFilterPeriode] = useState('all');
// //      const [filterPeriode] = useState('all');

// //     const facturesCollectionPath = useMemo(() => {
// //         if (!currentUserId) return null;
// //         return `artifacts/${appId}/users/${currentUserId}/factures`;
// //     }, [currentUserId]);

// //     useEffect(() => {
// //         if (!facturesCollectionPath) {
// //             setIsLoading(false);
// //             setFactures([]);
// //             return () => {};
// //         }
// //         setIsLoading(true);
// //         setError(null);
// //         const facturesRef = collection(db, facturesCollectionPath);
// //         const unsubscribe = onSnapshot(facturesRef,
// //             (snapshot) => {
// //                 const facturesData = snapshot.docs.map(doc => {
// //                     const data = doc.data();
// //                     return {
// //                         id: doc.id,
// //                         ...data,
// //                         dateEmission: data.dateEmission?.seconds ? new Date(data.dateEmission.seconds * 1000) : new Date(data.dateEmission),
// //                         totalAvecTva: parseFloat(data.totalAvecTva) || 0,
// //                         montantPaye: parseFloat(data.montantPaye) || 0,
// //                         items: Array.isArray(data.items) ? data.items.map(item => ({
// //                             ...item,
// //                             prixUnitaire: parseFloat(item.prixUnitaire) || 0,
// //                             quantite: parseFloat(item.quantite) || 0,
// //                         })) : [],
// //                     };
// //                 });
// //                 setFactures(facturesData);
// //                 setIsLoading(false);
// //             },
// //             (err) => {
// //                 console.error("SectionStatistiques: Erreur de récupération des factures: ", err);
// //                 setError("Erreur lors de la récupération des statistiques de factures.");
// //                 setIsLoading(false);
// //             }
// //         );
// //         return () => unsubscribe();
// //     }, [facturesCollectionPath]);

// //     const facturesFiltrees = useMemo(() => {
// //         if (filterPeriode === 'all') return factures;
// //         const now = new Date();
// //         const currentMonth = now.getMonth();
// //         const currentYear = now.getFullYear();

// //         return factures.filter(f => {
// //             const dateEmission = f.dateEmission;
// //             if (!dateEmission || !(dateEmission instanceof Date)) return false; 
// //             if (filterPeriode === 'currentMonth') {
// //                 return dateEmission.getMonth() === currentMonth && dateEmission.getFullYear() === currentYear;
// //             }
// //             if (filterPeriode === 'currentYear') {
// //                 return dateEmission.getFullYear() === currentYear;
// //             }
// //             return true;
// //         });
// //     }, [factures, filterPeriode]);


// //     const stats = useMemo(() => {
// //         const data = {
// //             chiffreAffairesTotal: 0,
// //             nombreTotalFactures: facturesFiltrees.length,
// //             montantMoyenFacture: 0,
// //             totalDu: 0,
// //             repartitionStatuts: {},
// //             revenusParCategorie: {},
// //             topClients: [],
// //         };

// //         const facturesPayantes = facturesFiltrees.filter(f => f.statut === 'Payée' || f.statut === 'Partiellement Payée');
        
// //         facturesPayantes.forEach(f => {
// //             data.chiffreAffairesTotal += f.montantPaye;
// //         });

// //         facturesFiltrees.forEach(f => {
// //             if (f.statut !== 'Annulée' && f.statut !== 'Payée') {
// //                 data.totalDu += (f.totalAvecTva - f.montantPaye);
// //             }
// //             data.repartitionStatuts[f.statut] = (data.repartitionStatuts[f.statut] || 0) + 1;

// //             if (f.statut === 'Payée' || f.statut === 'Partiellement Payée') {
// //                  f.items.forEach(item => {
// //                     const categorie = item.type || 'Non spécifié';
// //                     const revenuItemBrut = item.quantite * item.prixUnitaire;
// //                     const proportionPaiement = f.totalAvecTva > 0 ? f.montantPaye / f.totalAvecTva : 0;
// //                     const revenuItemNet = revenuItemBrut * proportionPaiement;
// //                     data.revenusParCategorie[categorie] = (data.revenusParCategorie[categorie] || 0) + revenuItemNet;
// //                 });
// //             }
// //         });
        
// //         const facturesValidesPourMoyenne = facturesFiltrees.filter(f => f.statut !== 'Annulée' && f.statut !== 'Brouillon');
// //         if (facturesValidesPourMoyenne.length > 0) {
// //             const totalMontantsFactures = facturesValidesPourMoyenne.reduce((sum, f) => sum + f.totalAvecTva, 0);
// //             data.montantMoyenFacture = totalMontantsFactures / facturesValidesPourMoyenne.length;
// //         }


// //         const revenusParClient = {};
// //         // S'assurer que 'clients' est un tableau avant d'appeler find
// //         const validClients = Array.isArray(clients) ? clients : [];
// //         facturesPayantes.forEach(f => {
// //             if (f.clientId) {
// //                 revenusParClient[f.clientId] = (revenusParClient[f.clientId] || 0) + f.montantPaye;
// //             }
// //         });
        
// //         data.topClients = Object.entries(revenusParClient)
// //             .map(([clientId, revenu]) => {
// //                 const clientInfo = validClients.find(c => c.id === clientId);
// //                 return {
// //                     nomClient: clientInfo ? `${clientInfo.nom} ${clientInfo.prenom}` : `Client ID: ${clientId.substring(0,8)}...`,
// //                     revenu: revenu
// //                 };
// //             })
// //             .sort((a, b) => b.revenu - a.revenu)
// //             .slice(0, 5);

// //         return data;
// //     }, [facturesFiltrees, clients]);

// //     const StatCard = ({ title, value, icon, unit = '', color = 'blue' }) => {
// //         const colors = {
// //             blue: 'border-blue-500 text-blue-600',
// //             green: 'border-green-500 text-green-600',
// //             yellow: 'border-yellow-500 text-yellow-600',
// //             red: 'border-red-500 text-red-600',
// //             purple: 'border-purple-500 text-purple-600',
// //         };
// //         return (
// //             <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${colors[color]} hover:shadow-xl transition-shadow duration-300`}>
// //                 <div className="flex items-center justify-between">
// //                     <div>
// //                         <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
// //                         <p className="text-3xl font-bold mt-1">{typeof value === 'number' ? value.toFixed(2) : value} {unit}</p>
// //                     </div>
// //                     {icon && <div className={`p-3 bg-${color}-100 rounded-full`}>{icon}</div>}
// //                 </div>
// //             </div>
// //         );
// //     };
    
// //     const ProgressBar = ({ label, value, total, color = "blue" }) => {
// //         const percentage = total > 0 ? (value / total) * 100 : 0;
// //         const colorClasses = {
// //             blue: "bg-blue-500",
// //             green: "bg-green-500",
// //             yellow: "bg-yellow-500",
// //             red: "bg-red-500",
// //             purple: "bg-purple-500",
// //             slate: "bg-slate-500",
// //         };

// //         return (
// //             <div className="mb-2">
// //                 <div className="flex justify-between text-sm text-slate-600 mb-1">
// //                     <span>{label} ({value})</span>
// //                     <span>{percentage.toFixed(1)}%</span>
// //                 </div>
// //                 <div className="w-full bg-slate-200 rounded-full h-2.5">
// //                     <div className={`${colorClasses[color]} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
// //                 </div>
// //             </div>
// //         );
// //     };
  
  
// //       // if (isLoading) {
// //       //     return (
// //       //         <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md">
// //       //             <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" />
// //       //             <p className="ml-4 text-slate-600 text-lg mt-4">Chargement des statistiques...</p>
// //       //         </div>
// //       //     );
// //       // }
  
// // //       //if (error) {
// // //       return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md shadow" role="alert"><p>{error}</p></div>;
// // // }
    
// //     const statutCouleurs = {
// //         "Brouillon": "slate",
// //         "Envoyée": "blue",
// //         "Payée": "green",
// //         "Partiellement Payée": "yellow",
// //         "Annulée": "red",
// //         "En Retard": "purple",
// //     };


// //     // const [setFilterPeriode] = useState("all");
// //     // const [ setStats] = useState({});
// //     // const [totalFactures, setTotalFactures] = useState(0);
// //     // function StatCard({ title, value, unit, icon, color }) 
// //     // {
// //     //  return (
// //     //     <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg">
// //     //         <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
// //     //             <h2 className="text-3xl font-bold text-slate-800 mb-4 sm:mb-0">Statistiques Financières</h2>
// //     //             <div className="flex items-center gap-2">
// //     //                 <CalendarDaysIcon className="w-5 h-5 text-slate-500"/>
// //     //                 <select 
// //     //                     value={filterPeriode} 
// //     //                     onChange={(e) => setFilterPeriode(e.target.value)}
// //     //                     className="p-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //     //                 >
// //     //                     <option value="all">Toutes les périodes</option>
// //     //                     <option value="currentMonth">Mois en cours</option>
// //     //                     <option value="currentYear">Année en cours</option>
// //     //                 </select>
// //     //             </div>
// //     //         </div>

// //     //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //     //             <StatCard title="Chiffre d'Affaires" value={stats.chiffreAffairesTotal} unit="€" icon={<BanknotesIcon className="w-7 h-7 text-green-500"/>} color="green"/>
// //     //             <StatCard title="Factures Émises" value={stats.nombreTotalFactures} icon={<ListBulletIcon className="w-7 h-7 text-blue-500"/>} color="blue"/>
// //     //             <StatCard title="Montant Moyen/Facture" value={stats.montantMoyenFacture} unit="€" icon={<DocumentChartBarIcon className="w-7 h-7 text-purple-500"/>} color="purple"/>
// //     //             <StatCard title="Total Dû" value={stats.totalDu < 0 ? 0 : stats.totalDu} unit="€" icon={<BanknotesIcon className="w-7 h-7 text-red-500"/>} color="red"/>
// //     //         </div>

// //     //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //     //             <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
// //     //                 <h3 className="text-xl font-semibold text-slate-700 mb-4">Répartition des Factures par Statut</h3>
// //     //                 {Object.entries(stats.repartitionStatuts).length > 0 ? 
// //     //                     Object.entries(stats.repartitionStatuts).map(([statut, count]) => (
// //     //                         <ProgressBar 
// //     //                             key={statut} 
// //     //                             label={statut} 
// //     //                             value={count} 
// //     //                             total={stats.nombreTotalFactures} 
// //     //                             color={statutCouleurs[statut] || 'slate'}
// //     //                         />
// //     //                     )) : <p className="text-slate-500">Aucune facture à afficher pour cette période.</p>
// //     //                 }
// //     //             </div>

// //     //             <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
// //     //                 <h3 className="text-xl font-semibold text-slate-700 mb-4">Revenus par Catégorie de Communiqué</h3>
// //     //                 {Object.entries(stats.revenusParCategorie).length > 0 ?
// //     //                     Object.entries(stats.revenusParCategorie)
// //     //                         .sort(([,a],[,b]) => b-a)
// //     //                         .map(([categorie, revenu]) => (
// //     //                         <div key={categorie} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
// //     //                             <span className="text-sm text-slate-600">{categorie}</span>
// //     //                             <span className="text-sm font-semibold text-green-600">{revenu.toFixed(2)} €</span>
// //     //                         </div>
// //     //                     )) : <p className="text-slate-500">Aucune donnée de revenu par catégorie pour cette période.</p>
// //     //                 }
// //     //             </div>

// //     //             <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
// //     //                 <h3 className="text-xl font-semibold text-slate-700 mb-4">Top 5 Clients</h3>
// //     //                 {stats.topClients.length > 0 ?
// //     //                     stats.topClients.map((client, index) => (
// //     //                         <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
// //     //                             <span className="text-sm text-slate-600 truncate" title={client.nomClient}>{index + 1}. {client.nomClient}</span>
// //     //                             <span className="text-sm font-semibold text-blue-600">{client.revenu.toFixed(2)} €</span>
// //     //                         </div>
// //     //                     )) : <p className="text-slate-500">Aucune donnée client pour cette période.</p>
// //     //                 }
// //     //             </div>
// //     //         </div>
// //     //     </div>
// //     // );
// // };

// import React, { useState, useEffect,  useMemo } from 'react';
// import { appId, firebaseConfig} from '../firebase/config';
// import { initializeApp } from 'firebase/app';
// import { 
// //     // auth,
// //     // getFirestore
  
//     collection, 
// //     // addDoc, 
// //     // doc, 
// //     // updateDoc, 
// //     // deleteDoc, 
//    onSnapshot 

//  } from 'firebase/firestore';

// // // Initialisation de Firebase

//  const app = initializeApp(firebaseConfig);
//  const db = getFirestore(app);
// // // const auth = getAuth(app);

// // // import React, { useState, useEffect, useCallback, useMemo } from 'react';

// export default SectionStatistiques ({ currentUserId, clients }) 
// {
//     const [factures, setFactures] = useState([]);
//     const [ setIsLoading] = useState(true);
//     const [ setError] = useState(null);
//     // constt [isLoading, setIsLoading] = useState(true);
//     // const [error, setError] = useState(null);
//     const [filterPeriode, setFilterPeriode] = useState('all');

//     const facturesCollectionPath = useMemo(() => {
//         if (!currentUserId) return null;
//         return `artifacts/${appId}/users/${currentUserId}/factures`;
//     }, [currentUserId]);

//     useEffect(() => {
//         if (!facturesCollectionPath) {
//             setIsLoading(false);
//             setFactures([]);
//             return () => {};
//         }
//         setIsLoading(true);
//         setError(null);
//         const facturesRef = collection(db, facturesCollectionPath);
//         const unsubscribe = onSnapshot(facturesRef,
//             (snapshot) => {
//                 const facturesData = snapshot.docs.map(doc => {
//                     const data = doc.data();
//                     return {
//                         id: doc.id,
//                         ...data,
//                         dateEmission: data.dateEmission?.seconds ? new Date(data.dateEmission.seconds * 1000) : new Date(data.dateEmission),
//                         totalAvecTva: parseFloat(data.totalAvecTva) || 0,
//                         montantPaye: parseFloat(data.montantPaye) || 0,
//                         items: Array.isArray(data.items) ? data.items.map(item => ({
//                             ...item,
//                             prixUnitaire: parseFloat(item.prixUnitaire) || 0,
//                             quantite: parseFloat(item.quantite) || 0,
//                         })) : [],
//                     };
//                 });
//                 setFactures(facturesData);
//                 setIsLoading(false);
//             },
//             (err) => {
//                 console.error("SectionStatistiques: Erreur de récupération des factures: ", err);
//                 setError("Erreur lors de la récupération des statistiques de factures.");
//                 setIsLoading(false);
//             }
//         );
//         return () => unsubscribe();
//     }, [facturesCollectionPath]);

//     const facturesFiltrees = useMemo(() => {
//         if (filterPeriode === 'all') return factures;
//         const now = new Date();
//         const currentMonth = now.getMonth();
//         const currentYear = now.getFullYear();

//         return factures.filter(f => {
//             const dateEmission = f.dateEmission;
//             if (!dateEmission || !(dateEmission instanceof Date)) return false; 
//             if (filterPeriode === 'currentMonth') {
//                 return dateEmission.getMonth() === currentMonth && dateEmission.getFullYear() === currentYear;
//             }
//             if (filterPeriode === 'currentYear') {
//                 return dateEmission.getFullYear() === currentYear;
//             }
//             return true;
//         });
//     }, [factures, filterPeriode]);


//     const stats = useMemo(() => {
//         const data = {
//             chiffreAffairesTotal: 0,
//             nombreTotalFactures: facturesFiltrees.length,
//             montantMoyenFacture: 0,
//             totalDu: 0,
//             repartitionStatuts: {},
//             revenusParCategorie: {},
//             topClients: [],
//         };

//         const facturesPayantes = facturesFiltrees.filter(f => f.statut === 'Payée' || f.statut === 'Partiellement Payée');
        
//         facturesPayantes.forEach(f => {
//             data.chiffreAffairesTotal += f.montantPaye;
//         });

//         facturesFiltrees.forEach(f => {
//             if (f.statut !== 'Annulée' && f.statut !== 'Payée') {
//                 data.totalDu += (f.totalAvecTva - f.montantPaye);
//             }
//             data.repartitionStatuts[f.statut] = (data.repartitionStatuts[f.statut] || 0) + 1;

//             if (f.statut === 'Payée' || f.statut === 'Partiellement Payée') {
//                  f.items.forEach(item => {
//                     const categorie = item.type || 'Non spécifié';
//                     const revenuItemBrut = item.quantite * item.prixUnitaire;
//                     const proportionPaiement = f.totalAvecTva > 0 ? f.montantPaye / f.totalAvecTva : 0;
//                     const revenuItemNet = revenuItemBrut * proportionPaiement;
//                     data.revenusParCategorie[categorie] = (data.revenusParCategorie[categorie] || 0) + revenuItemNet;
//                 });
//             }
//         });
        
//         const facturesValidesPourMoyenne = facturesFiltrees.filter(f => f.statut !== 'Annulée' && f.statut !== 'Brouillon');
//         if (facturesValidesPourMoyenne.length > 0) {
//             const totalMontantsFactures = facturesValidesPourMoyenne.reduce((sum, f) => sum + f.totalAvecTva, 0);
//             data.montantMoyenFacture = totalMontantsFactures / facturesValidesPourMoyenne.length;
//         }


//         const revenusParClient = {};
//         // S'assurer que 'clients' est un tableau avant d'appeler find
//         const validClients = Array.isArray(clients) ? clients : [];
//         facturesPayantes.forEach(f => {
//             if (f.clientId) {
//                 revenusParClient[f.clientId] = (revenusParClient[f.clientId] || 0) + f.montantPaye;
//             }
//         });
        
//         data.topClients = Object.entries(revenusParClient)
//             .map(([clientId, revenu]) => {
//                 const clientInfo = validClients.find(c => c.id === clientId);
//                 return {
//                     nomClient: clientInfo ? `${clientInfo.nom} ${clientInfo.prenom}` : `Client ID: ${clientId.substring(0,8)}...`,
//                     revenu: revenu
//                 };
//             })
//             .sort((a, b) => b.revenu - a.revenu)
//             .slice(0, 5);

//         return data;
//     }, [facturesFiltrees, clients]);

//     const StatCard = ({ title, value, icon, unit = '', color = 'blue' }) => {
//         const colors = {
//             blue: 'border-blue-500 text-blue-600',
//             green: 'border-green-500 text-green-600',
//             yellow: 'border-yellow-500 text-yellow-600',
//             red: 'border-red-500 text-red-600',
//             purple: 'border-purple-500 text-purple-600',
//         };
//         return (
//             <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${colors[color]} hover:shadow-xl transition-shadow duration-300`}>
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
//                         <p className="text-3xl font-bold mt-1">{typeof value === 'number' ? value.toFixed(2) : value} {unit}</p>
//                     </div>
//                     {icon && <div className={`p-3 bg-${color}-100 rounded-full`}>{icon}</div>}
//                 </div>
//             </div>
//         );
//     };
    
//     const ProgressBar = ({ label, value, total, color = "blue" }) => {
//         const percentage = total > 0 ? (value / total) * 100 : 0;
//         const colorClasses = {
//             blue: "bg-blue-500",
//             green: "bg-green-500",
//             yellow: "bg-yellow-500",
//             red: "bg-red-500",
//             purple: "bg-purple-500",
//             slate: "bg-slate-500",
//         };

//         return (
//             <div className="mb-2">
//                 <div className="flex justify-between text-sm text-slate-600 mb-1">
//                     <span>{label} ({value})</span>
//                     <span>{percentage.toFixed(1)}%</span>
//                 </div>
//                 <div className="w-full bg-slate-200 rounded-full h-2.5">
//                     <div className={`${colorClasses[color]} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
//                 </div>
//             </div>
//         );
//     };

//     const handleSaveClient = async (clientData) => {
//         try {
//             if (currentClient && currentClient.id) { 
//                 await updateDoc(doc(clientsCollectionRef, currentClient.id), clientData);
//                 showNotification("Client modifié avec succès.", "success");
//             } else { 
//                 await addDoc(clientsCollectionRef, { ...clientData, createdAt: Timestamp.now(), createdBy: userId });
//                 showNotification("Client ajouté avec succès.", "success");
//             }
//             setShowModal(false);
//         } catch (error) {
//             console.error("Erreur enregistrement client:", error);
//             showNotification("Erreur lors de l'enregistrement du client.", "error");
//         }
    
//     // if (isLoading) {
//     //     return (
//     //         <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md">
//     //             <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" />
//     //             <p className="ml-4 text-slate-600 text-lg mt-4">Chargement des statistiques...</p>
//     //         </div>
//     //     );
//     // }

//     // if (error) {
//     //     return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md shadow" role="alert"><p>{error}</p></div>;
//     // }
//     };
    
//     const statutCouleurs = {
//         "Brouillon": "slate",
//         "Envoyée": "blue",
//         "Payée": "green",
//         "Partiellement Payée": "yellow",
//         "Annulée": "red",
//         "En Retard": "purple",
    
//     }

//     return (
//         <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg">
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
//                 <h2 className="text-3xl font-bold text-slate-800 mb-4 sm:mb-0">Statistiques Financières</h2>
//                 <div className="flex items-center gap-2">
//                     <CalendarDaysIcon className="w-5 h-5 text-slate-500"/>
//                     <select 
//                         value={filterPeriode} 
//                         onChange={(e) => setFilterPeriode(e.target.value)}
//                         className="p-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                         <option value="all">Toutes les périodes</option>
//                         <option value="currentMonth">Mois en cours</option>
//                         <option value="currentYear">Année en cours</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 <StatCard title="Chiffre d'Affaires" value={stats.chiffreAffairesTotal} unit="€" icon={<BanknotesIcon className="w-7 h-7 text-green-500"/>} color="green"/>
//                 <StatCard title="Factures Émises" value={stats.nombreTotalFactures} icon={<ListBulletIcon className="w-7 h-7 text-blue-500"/>} color="blue"/>
//                 <StatCard title="Montant Moyen/Facture" value={stats.montantMoyenFacture} unit="€" icon={<DocumentChartBarIcon className="w-7 h-7 text-purple-500"/>} color="purple"/>
//                 <StatCard title="Total Dû" value={stats.totalDu < 0 ? 0 : stats.totalDu} unit="€" icon={<BanknotesIcon className="w-7 h-7 text-red-500"/>} color="red"/>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
//                     <h3 className="text-xl font-semibold text-slate-700 mb-4">Répartition des Factures par Statut</h3>
//                     {Object.entries(stats.repartitionStatuts).length > 0 ? 
//                         Object.entries(stats.repartitionStatuts).map(([statut, count]) => (
//                             <ProgressBar 
//                                 key={statut} 
//                                 label={statut} 
//                                 value={count} 
//                                 total={stats.nombreTotalFactures} 
//                                 color={statutCouleurs[statut] || 'slate'}
//                             />
//                         )) : <p className="text-slate-500">Aucune facture à afficher pour cette période.</p>
//                     }
//                 </div>

//                 <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
//                     <h3 className="text-xl font-semibold text-slate-700 mb-4">Revenus par Catégorie de Communiqué</h3>
//                     {Object.entries(stats.revenusParCategorie).length > 0 ?
//                         Object.entries(stats.revenusParCategorie)
//                             .sort(([,a],[,b]) => b-a)
//                             .map(([categorie, revenu]) => (
//                             <div key={categorie} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
//                                 <span className="text-sm text-slate-600">{categorie}</span>
//                                 <span className="text-sm font-semibold text-green-600">{revenu.toFixed(2)} €</span>
//                             </div>
//                         )) : <p className="text-slate-500">Aucune donnée de revenu par catégorie pour cette période.</p>
//                     }
//                 </div>

//                 <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
//                     <h3 className="text-xl font-semibold text-slate-700 mb-4">Top 5 Clients</h3>
//                     {stats.topClients.length > 0 ?
//                         stats.topClients.map((client, index) => (
//                             <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
//                                 <span className="text-sm text-slate-600 truncate" title={client.nomClient}>{index + 1}. {client.nomClient}</span>
//                                 <span className="text-sm font-semibold text-blue-600">{client.revenu.toFixed(2)} €</span>
//                             </div>
//                         )) : <p className="text-slate-500">Aucune donnée client pour cette période.</p>
//                     }
//                 </div>
//             </div>
//         </div>
//     );
// };


// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { db, auth, appId } from '../firebase/config'; // Assurez-vous que le chemin est correct
import React, { useState, useEffect,useCallback, useMemo } from 'react';
import { db,appId } from '../firebase/config'; // Assurez-vous que le chemin est correct
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ArrowPathIcon, PlusIcon, PencilIcon,ChevronDownIcon, TrashIcon, EyeIcon, CalendarDaysIcon,  XMarkIcon,BanknotesIcon,ListBulletIcon,DocumentChartBarIcon, MagnifyingGlassIcon}  from '@heroicons/react/24/outline';
// import { 
//     ArrowPathIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, PrinterIcon, XMarkIcon
// } from '@heroicons/react/24/outline';


// --- COMPOSANTS UI (À centraliser dans src/components/ plus tard) ---

const Modal = ({ isOpen, onClose, title, children, size = "2xl" }) => {
    if (!isOpen) return null;
    const maxWidthClass = { "lg": "max-w-lg", "xl": "max-w-xl", "2xl": "max-w-2xl", "3xl": "max-w-3xl" }[size];
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
        <input id={id} type={type} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`} />
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

const TextareaField = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={id} {...props} className={`w-full p-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);


// --- SOUS-COMPOSANTS DE FACTURATION ---

// const InvoiceItemForm = ({ item, index, onChange, onRemove, error }) => {
//     // ... (Le code de ce composant reste identique à la version complète)
//     const handleItemChange = (field, value) => {
//         onChange(index, field, value);
//     };

//     return (
//         <div className={`grid grid-cols-1 md:grid-cols-10 gap-3 mb-3 p-3 border ${error ? 'border-red-300' : 'border-slate-200'} rounded-lg items-start`}>
//             <div className="md:col-span-4">
//                 <input
//                     type="text"
//                     placeholder="Description"
//                     value={item.description}
//                     onChange={(e) => handleItemChange('description', e.target.value)}
//                     className={`w-full p-2 border ${error?.description ? 'border-red-500' : 'border-slate-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow`}
//                 />
//                 {error?.description && <p className="mt-1 text-xs text-red-600">{error.description}</p>}
//             </div>
//             <div className="md:col-span-1">
//                 <input
//                     type="number"
//                     placeholder="Qté"
//                     value={item.quantite}
//                     onChange={(e) => handleItemChange('quantite', parseFloat(e.target.value) || '')}
//                     className={`w-full p-2 border ${error?.quantite ? 'border-red-500' : 'border-slate-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow`}
//                     min="0"
//                     step="any"
//                 />
//                 {error?.quantite && <p className="mt-1 text-xs text-red-600">{error.quantite}</p>}
//             </div>
//              <div className="md:col-span-2">
//                 <input
//                     type="number"
//                     placeholder="Prix Unit."
//                     value={item.prixUnitaire}
//                     onChange={(e) => handleItemChange('prixUnitaire', parseFloat(e.target.value) || '')}
//                     className={`w-full p-2 border ${error?.prixUnitaire ? 'border-red-500' : 'border-slate-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow`}
//                     min="0"
//                     step="any"
//                 />
//                 {error?.prixUnitaire && <p className="mt-1 text-xs text-red-600">{error.prixUnitaire}</p>}
//             </div>
//             <p className="md:col-span-2 p-2 text-slate-700 text-right self-center">
//                 {(parseFloat(item.quantite) * parseFloat(item.prixUnitaire) || 0).toFixed(2)} €
//             </p>
//             <button 
//                 type="button" 
//                 onClick={() => onRemove(index)}
//                 className="md:col-span-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center justify-center transition-colors self-center"
//             >
//                 <TrashIcon className="w-5 h-5" />
//             </button>
//         </div>
//     );
// };

const FactureForm = ({ initialFacture, onSave, onCancel, clients, communiquesEmissions }) => {
    // ... (Le code de ce composant reste identique à la version complète)
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
                    {clients.map(client => (
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
                    {communiquesEmissions.map(ce => (
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


const FactureList = ({ factures, onEdit, onDelete, onView, sortConfig, requestSort, filterText, setFilterText, filterStatus, setFilterStatus }) => {
    // ... (Le code de ce composant reste identique à la version complète)
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

// const FactureDetail = ({ facture, onClose }) => {
//     // ... (Le code de ce composant reste identique à la version complète)
//     if (!facture) return null;

//     const handlePrint = () => {
//         const printableArea = document.querySelector('.printable-area');
//         if (printableArea) {
//             const printContents = printableArea.innerHTML;
            
//             const iframe = document.createElement('iframe');
//             iframe.style.height = '0';
//             iframe.style.width = '0';
//             iframe.style.position = 'absolute';
//             iframe.style.border = '0';
//             document.body.appendChild(iframe);
            
//             const iframeDoc = iframe.contentWindow.document;
//             iframeDoc.open();
//             iframeDoc.write('<html><head><title>Facture</title>');
//             iframeDoc.write('<script src="https://cdn.tailwindcss.com"></script>');
//             iframeDoc.write('<style>@media print { @page { size: A4; margin: 20mm; } body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; font-family: "Inter", sans-serif; } .print-bg-slate-50 { background-color: #f8fafc !important; } .print-bg-slate-100 { background-color: #f1f5f9 !important; } .print-border { border: 1px solid #e2e8f0 !important; } .print-border-slate-300 { border-color: #cbd5e1 !important; } .print-text-xs { font-size: 0.75rem !important; } .print-text-sm { font-size: 0.875rem !important; } .print-text-base { font-size: 1rem !important; } .print-text-lg { font-size: 1.125rem !important; } .print-text-xl { font-size: 1.25rem !important; } .print-text-2xl { font-size: 1.5rem !important; } .print-text-3xl { font-size: 1.875rem !important; } }</style>');
//             iframeDoc.write('</head><body>');
//             iframeDoc.write(printContents);
//             iframeDoc.write('</body></html>');
//             iframeDoc.close();
            
//             iframe.contentWindow.focus();
//             iframe.contentWindow.print();
            
//             setTimeout(() => {
//                  document.body.removeChild(iframe);
//             }, 500);

//         } else {
//             console.error("Erreur: Zone imprimable non trouvée.");
//         }
//     };
    
//     const getStatusColorText = (status) => {
//         switch (status) {
//             case 'Payée': return 'text-green-600';
//             case 'Partiellement Payée': return 'text-yellow-600';
//             case 'Envoyée': return 'text-blue-600';
//             case 'En Retard': return 'text-red-600';
//             case 'Annulée': return 'text-slate-500';
//             case 'Brouillon':
//             default: return 'text-slate-600';
//         }
//     };
    
//     const factureDateEmission = facture.dateEmission?.seconds ? new Date(facture.dateEmission.seconds * 1000) : new Date(facture.dateEmission);
//     const factureDateEcheance = facture.dateEcheance?.seconds ? new Date(facture.dateEcheance.seconds * 1000) : (facture.dateEcheance ? new Date(facture.dateEcheance) : null);


//     return (
//         <>
//             <div className="printable-area p-2">
//                 <div className="flex justify-between items-start mb-8 print-mb-8">
//                     <div>
//                         <h2 className="text-3xl font-bold text-slate-800 print-text-3xl">FACTURE</h2>
//                         <p className="text-slate-600 print-text-base">Numéro: <span className="font-semibold">{facture.numeroFacture}</span></p>
//                         <p className={`text-lg font-semibold ${getStatusColorText(facture.statut)} print-text-lg`}>Statut: {facture.statut}</p>
//                     </div>
//                     <div className="text-right">
//                         <p className="font-semibold text-slate-700 print-text-base">Votre Entreprise Radio</p>
//                         <p className="text-sm text-slate-500 print-text-sm">123 Rue de la Radio, Ville, Pays</p>
//                         <p className="text-sm text-slate-500 print-text-sm">Tel: +00 123 456 789</p>
//                         <p className="text-sm text-slate-500 print-text-sm">Email: contact@radio.com</p>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print-grid print-grid-cols-2 print-gap-4 print-mb-8">
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 print-bg-slate-50 print-p-4 print-rounded-md print-border">
//                         <h3 className="font-semibold text-slate-700 mb-2 print-text-base">Client:</h3>
//                         <p className="text-slate-600 print-text-base">{facture.clientDetails?.nom} {facture.clientDetails?.prenom}</p>
//                         <p className="text-sm text-slate-500 print-text-sm">{facture.clientDetails?.tel}</p>
//                         <p className="text-sm text-slate-500 print-text-sm">{facture.clientDetails?.email}</p>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-right md:text-left print-bg-slate-50 print-p-4 print-rounded-md print-border">
//                         <h3 className="font-semibold text-slate-700 mb-2 print-text-base">Dates:</h3>
//                         <p className="text-slate-600 print-text-base">Émission: <span className="font-medium">{factureDateEmission.toLocaleDateString()}</span></p>
//                         {factureDateEcheance && <p className="text-slate-600 print-text-base">Échéance: <span className="font-medium">{factureDateEcheance.toLocaleDateString()}</span></p>}
//                     </div>
//                 </div>

//                 <div className="mb-8 print-mb-8">
//                     <h3 className="text-lg font-semibold text-slate-700 mb-3 print-text-lg">Détail des prestations :</h3>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-slate-300 border border-slate-300 print-border print-border-slate-300">
//                             <thead className="bg-slate-100 print-bg-slate-100">
//                                 <tr>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider print-text-xs">Description</th>
//                                     <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider print-text-xs">Qté</th>
//                                     <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider print-text-xs">Prix Unit.</th>
//                                     <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider print-text-xs">Total Partiel</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-slate-200 print-border-slate-300">
//                                 {facture.items?.map((item, index) => (
//                                     <tr key={index}>
//                                         <td className="px-4 py-2 whitespace-normal text-sm text-slate-600 print-text-sm">{item.description}</td>
//                                         <td className="px-4 py-2 text-right whitespace-nowrap text-sm text-slate-600 print-text-sm">{item.quantite}</td>
//                                         <td className="px-4 py-2 text-right whitespace-nowrap text-sm text-slate-600 print-text-sm">{parseFloat(item.prixUnitaire || 0).toFixed(2)} €</td>
//                                         <td className="px-4 py-2 text-right whitespace-nowrap text-sm text-slate-600 font-medium print-text-sm">{(parseFloat(item.quantite) * parseFloat(item.prixUnitaire) || 0).toFixed(2)} €</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
                
//                 <div className="flex justify-end mb-8 print-mb-8">
//                     <div className="w-full md:w-1/2 lg:w-2/5 space-y-2">
//                         <div className="flex justify-between text-slate-600 print-text-base">
//                             <span>Sous-total:</span>
//                             <span className="font-medium">{parseFloat(facture.sousTotal || 0).toFixed(2)} €</span>
//                         </div>
//                         <div className="flex justify-between text-slate-600 print-text-base">
//                             <span>TVA ({facture.tvaPourcentage}%):</span>
//                             <span className="font-medium">{parseFloat(facture.montantTva || 0).toFixed(2)} €</span>
//                         </div>
//                         <div className="flex justify-between text-xl font-bold text-slate-800 pt-2 border-t border-slate-300 print-text-xl print-border-slate-300">
//                             <span>TOTAL:</span>
//                             <span>{parseFloat(facture.totalAvecTva || 0).toFixed(2)} €</span>
//                         </div>
//                          <div className="flex justify-between text-slate-600 print-text-base">
//                             <span>Montant Payé:</span>
//                             <span className="font-medium text-green-600">{parseFloat(facture.montantPaye || 0).toFixed(2)} €</span>
//                         </div>
//                         <div className={`flex justify-between text-lg font-semibold ${parseFloat(facture.soldeDu || 0) > 0 ? 'text-red-600' : 'text-green-600'} print-text-lg`}>
//                             <span>SOLDE DÛ:</span>
//                             <span>{parseFloat(facture.soldeDu || 0).toFixed(2)} €</span>
//                         </div>
//                     </div>
//                 </div>

//                 {(facture.responsableDiffusion || facture.planAbonnementDetails || facture.notes) && (
//                     <div className="mb-8 print-mb-8 border-t border-slate-200 pt-4 print-border-slate-300">
//                         {facture.responsableDiffusion && <p className="text-sm text-slate-500 print-text-sm"><strong>Responsable de diffusion:</strong> {facture.responsableDiffusion}</p>}
//                         {facture.planAbonnementDetails && <p className="text-sm text-slate-500 print-text-sm mt-1"><strong>Plan d'abonnement:</strong> {facture.planAbonnementDetails}</p>}
//                         {facture.notes && (
//                             <div className="mt-4 print-mt-4">
//                                 <h4 className="font-semibold text-slate-700 mb-1 print-text-base">Notes:</h4>
//                                 <p className="text-sm text-slate-500 whitespace-pre-wrap print-text-sm">{facture.notes}</p>
//                             </div>
//                         )}
//                     </div>
//                 )}
                
//                  <div className="text-center text-xs text-slate-400 pt-6 border-t border-slate-200 print-mt-6 print-border-slate-300">
//                     Merci de votre confiance ! Conditions de paiement : 30 jours nets.
//                 </div>
//             </div>

//             <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200 no-print">
//                 <button 
//                     onClick={onClose}
//                     className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out flex items-center"
//                 >
//                    <XMarkIcon className="w-5 h-5 mr-2"/> Fermer
//                 </button>
//                 <button 
//                     onClick={handlePrint}
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out flex items-center"
//                 >
//                     <PrinterIcon className="w-5 h-5 mr-2"/> Imprimer la Facture
//                 </button>
//             </div>
//         </>
//     );
// };


// export default function GestionFacturation  ({ clients, communiquesEmissions, currentUserId }) 
//  {
//     const [facturesBrutes, setFacturesBrutes] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//     const [currentFacture, setCurrentFacture] = useState(null);
//     const [error, setError] = useState(null);

//     const [filterText, setFilterText] = useState('');
//     const [filterStatus, setFilterStatus] = useState('');
//     const [sortConfig, setSortConfig] = useState({ key: 'dateEmission', direction: 'descending' });


//     const facturesCollectionPath = useMemo(() => {
//         if (!currentUserId) return null;
//         return `artifacts/${appId}/users/${currentUserId}/factures`;
//     }, [currentUserId]);


//     useEffect(() => {
//         if (!facturesCollectionPath) {
//             setIsLoading(false);
//             setFacturesBrutes([]);
//             return () => {};
//         }
        
//         setIsLoading(true);
//         setError(null);
        
//         const facturesRef = collection(db, facturesCollectionPath);
//         const unsubscribe = onSnapshot(facturesRef, 
//             (snapshot) => {
//                 const facturesData = snapshot.docs.map(doc => {
//                     const data = doc.data();
//                     return { 
//                         id: doc.id, 
//                         ...data,
//                         dateEmission: data.dateEmission?.seconds ? new Date(data.dateEmission.seconds * 1000) : (data.dateEmission ? new Date(data.dateEmission) : null),
//                         dateEcheance: data.dateEcheance?.seconds ? new Date(data.dateEcheance.seconds * 1000) : (data.dateEcheance ? new Date(data.dateEcheance) : null),
//                     };
//                 });
//                 setFacturesBrutes(facturesData);
//                 setIsLoading(false);
//             },
//             (err) => {
//                 console.error("GestionFacturation: Erreur de récupération des factures: ", err);
//                 setError("Erreur lors de la récupération des factures. Détails: " + err.message);
//                 setIsLoading(false);
//             }
//         );
//         return () => unsubscribe();
//     }, [facturesCollectionPath]);

//     const requestSort = (key) => {
//         let direction = 'ascending';
//         if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//             direction = 'descending';
//         }
//         setSortConfig({ key, direction });
//     };

//     const filteredAndSortedFactures = useMemo(() => {
//         let sortableFactures = [...facturesBrutes];

//         if (filterText) {
//             sortableFactures = sortableFactures.filter(facture =>
//                 facture.numeroFacture?.toLowerCase().includes(filterText.toLowerCase()) ||
//                 (facture.clientDetails?.nom && facture.clientDetails.nom.toLowerCase().includes(filterText.toLowerCase())) ||
//                 (facture.clientDetails?.prenom && facture.clientDetails.prenom.toLowerCase().includes(filterText.toLowerCase()))
//             );
//         }
//         if (filterStatus) {
//             sortableFactures = sortableFactures.filter(facture => facture.statut === filterStatus);
//         }

//         if (sortConfig.key !== null) {
//             sortableFactures.sort((a, b) => {
//                 const getNestedValue = (obj, path) => path.split('.').reduce((value, key) => (value && typeof value === 'object' && value[key] !== undefined) ? value[key] : undefined, obj);

//                 let valA = getNestedValue(a, sortConfig.key);
//                 let valB = getNestedValue(b, sortConfig.key);
                
//                 if (valA instanceof Date && valB instanceof Date) {
//                      return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
//                 }

//                 if (valA === undefined || valA === null) return sortConfig.direction === 'ascending' ? 1 : -1;
//                 if (valB === undefined || valB === null) return sortConfig.direction === 'ascending' ? -1 : 1;

//                 if (typeof valA === 'number' && typeof valB === 'number') {
//                     return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
//                 }
                
//                 const strA = String(valA).toLowerCase();
//                 const strB = String(valB).toLowerCase();

//                 if (strA < strB) {
//                     return sortConfig.direction === 'ascending' ? -1 : 1;
//                 }
//                 if (strA > strB) {
//                     return sortConfig.direction === 'ascending' ? 1 : -1;
//                 }
//                 return 0;
//             });
//         }
//         return sortableFactures;
//     }, [facturesBrutes, filterText, filterStatus, sortConfig]);


//     const handleOpenFormModal = (facture = null) => {
//         setCurrentFacture(facture);
//         setIsFormModalOpen(true);
//     };

//     const handleCloseFormModal = () => {
//         setIsFormModalOpen(false);
//         setCurrentFacture(null);
//     };

//     const handleOpenDetailModal = (facture) => {
//         setCurrentFacture(facture);
//         setIsDetailModalOpen(true);
//     };

//     const handleCloseDetailModal = () => {
//         setIsDetailModalOpen(false);
//         setCurrentFacture(null);
//     };

//     const handleSaveFacture = async (factureData) => {
//         if (!facturesCollectionPath) {
//             setError("Impossible de sauvegarder : chemin de collection non défini (ID utilisateur manquant ?).");
//             return;
//         }
//         setError(null);
//         try {
//             const dataToSave = {
//                 ...factureData,
//                 dateEmission: new Date(factureData.dateEmission),
//                 dateEcheance: factureData.dateEcheance ? new Date(factureData.dateEcheance) : null,
//                 items: factureData.items.map(item => ({
//                     ...item,
//                     quantite: parseFloat(item.quantite) || 0,
//                     prixUnitaire: parseFloat(item.prixUnitaire) || 0,
//                     type: item.type || 'Autre',
//                 })),
//                 tvaPourcentage: parseFloat(factureData.tvaPourcentage) || 0,
//                 montantPaye: parseFloat(factureData.montantPaye) || 0,
//             };

//             if (dataToSave.id) {
//                 const factureRef = doc(db, facturesCollectionPath, dataToSave.id);
//                 await updateDoc(factureRef, dataToSave);
//             } else { 
//                 const { id, ...finalData } = dataToSave;
//                 await addDoc(collection(db, facturesCollectionPath), finalData);
//             }
//             handleCloseFormModal();
//         } catch (err) {
//             console.error("GestionFacturation: Erreur lors de la sauvegarde de la facture: ", err);
//             setError("Erreur lors de la sauvegarde de la facture. Détails: " + err.message + (err.details ? ` (${err.details})` : ''));
//         }
//     };

//     const handleDeleteFacture = async (factureId) => {
//         if (!facturesCollectionPath) {
//             setError("Impossible de supprimer : chemin de collection non défini.");
//             return;
//         }
//         setError(null);
//         if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.")) {
//             try {
//                 const factureRef = doc(db, facturesCollectionPath, factureId);
//                 await deleteDoc(factureRef);
//             } catch (err) {
//                 console.error("GestionFacturation: Erreur lors de la suppression de la facture: ", err);
//                 setError("Erreur lors de la suppression de la facture. Détails: " + err.message);
//             }
//         }
//     };
    
//     if (!currentUserId) {
//          return (
//             <div className="p-6 bg-white rounded-xl shadow-lg">
//                 <h2 className="text-2xl font-semibold text-slate-800 mb-6">Gestion des Factures</h2>
//                 <p className="text-center text-slate-500 py-8">Veuillez vous connecter pour gérer les factures.</p>
//                  {error && <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>}
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg min-h-screen">
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
//                 <h2 className="text-3xl font-bold text-slate-800 mb-4 sm:mb-0">Gestion des Factures</h2>
//                 <button
//                     onClick={() => handleOpenFormModal()}
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                 >
//                     <PlusIcon className="w-5 h-5 mr-2" /> Nouvelle Facture
//                 </button>
//             </div>

//             {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md relative mb-6 shadow" role="alert">
//                 <strong className="font-bold">Erreur: </strong>
//                 <span className="block sm:inline">{error}</span>
//                  <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
//                     <XMarkIcon className="w-5 h-5 text-red-700"/>
//                 </button>
//             </div>}

//             {isLoading ? (
//                 <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md">
//                     <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" />
//                     <p className="ml-4 text-slate-600 text-lg mt-4">Chargement des factures...</p>
//                 </div>
//             ) : (
//                 <FactureList
//                     factures={filteredAndSortedFactures}
//                     onEdit={handleOpenFormModal}
//                     onDelete={handleDeleteFacture}
//                     onView={handleOpenDetailModal}
//                     sortConfig={sortConfig}
//                     requestSort={requestSort}
//                     filterText={filterText}
//                     setFilterText={setFilterText}
//                     filterStatus={filterStatus}
//                     setFilterStatus={setFilterStatus}
//                 />
//             )}

//             <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={currentFacture?.id ? "Modifier la Facture" : "Créer une Nouvelle Facture"}>
//                 <FactureForm
//                     initialFacture={currentFacture}
//                     onSave={handleSaveFacture}
//                     onCancel={handleCloseFormModal}
//                     clients={clients} 
//                     communiquesEmissions={communiquesEmissions} 
//                 />
//             </Modal>

//             <Modal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} title="Détail de la Facture" size="3xl">
//                 {currentFacture && <FactureDetail facture={currentFacture} onClose={handleCloseDetailModal} />}
//             </Modal>
//         </div>
//     );
// };

export default function SectionStatistiques ({ currentUserId, clients }) {
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
// --- COMPOSANT PRINCIPAL DE LA SECTION ---

// export default function GestionFacturation({ clients, communiquesEmissions, currentUserId }) {
//     const [facturesBrutes, setFacturesBrutes] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//     const [currentFacture, setCurrentFacture] = useState(null);
//     const [error, setError] = useState(null);

//     const [filterText, setFilterText] = useState('');
//     const [filterStatus, setFilterStatus] = useState('');
//     const [sortConfig, setSortConfig] = useState({ key: 'dateEmission', direction: 'descending' });

// export default function GestionFacturation({ clients, communiquesEmissions, currentUserId }) {
//     const [facturesBrutes, setFacturesBrutes] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//     const [currentFacture, setCurrentFacture] = useState(null);
//     const [error, setError] = useState(null);

//     const [filterText, setFilterText] = useState('');
//     const [filterStatus, setFilterStatus] = useState('');
//     const [sortConfig, setSortConfig] = useState({ key: 'dateEmission', direction: 'descending' });

//     const facturesCollectionPath = useMemo(() => {
//         if (!currentUserId) return null;
//         return `artifacts/${appId}/users/${currentUserId}/factures`;
//     }, [currentUserId]);

//     useEffect(() => {
//         if (!facturesCollectionPath) {
//             setIsLoading(false);
//             setFacturesBrutes([]);
//             return;
//         }
        
//         setIsLoading(true);
//         const facturesRef = collection(db, facturesCollectionPath);
//         const unsubscribe = onSnapshot(facturesRef, 
//             (snapshot) => {
//                 const facturesData = snapshot.docs.map(doc => {
//                     const data = doc.data();
//                     return { 
//                         id: doc.id, 
//                         ...data,
//                         dateEmission: data.dateEmission?.seconds ? new Date(data.dateEmission.seconds * 1000) : (data.dateEmission ? new Date(data.dateEmission) : null),
//                         dateEcheance: data.dateEcheance?.seconds ? new Date(data.dateEcheance.seconds * 1000) : (data.dateEcheance ? new Date(data.dateEcheance) : null),
//                     };
//                 });
//                 setFacturesBrutes(facturesData);
//                 setIsLoading(false);
//             },
//             (err) => {
//                 setError("Erreur lors de la récupération des factures.");
//                 setIsLoading(false);
//             }
//         );
//         return () => unsubscribe();
//     }, [facturesCollectionPath]);

//     const requestSort = (key) => {
//         let direction = 'ascending';
//         if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//             direction = 'descending';
//         }
//         setSortConfig({ key, direction });
//     };

//     const filteredAndSortedFactures = useMemo(() => {
//         let sortableFactures = [...facturesBrutes];

//         if (filterText) {
//             sortableFactures = sortableFactures.filter(facture =>
//                 facture.numeroFacture?.toLowerCase().includes(filterText.toLowerCase()) ||
//                 (facture.clientDetails?.nom && facture.clientDetails.nom.toLowerCase().includes(filterText.toLowerCase())) ||
//                 (facture.clientDetails?.prenom && facture.clientDetails.prenom.toLowerCase().includes(filterText.toLowerCase()))
//             );
//         }
//         if (filterStatus) {
//             sortableFactures = sortableFactures.filter(facture => facture.statut === filterStatus);
//         }

//         if (sortConfig.key !== null) {
//             sortableFactures.sort((a, b) => {
//                 const getNestedValue = (obj, path) => path.split('.').reduce((value, key) => (value && typeof value === 'object' && value[key] !== undefined) ? value[key] : undefined, obj);
//                 let valA = getNestedValue(a, sortConfig.key);
//                 let valB = getNestedValue(b, sortConfig.key);
                
//                 if (valA instanceof Date && valB instanceof Date) {
//                      return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
//                 }
//                 if (valA === undefined || valA === null) return sortConfig.direction === 'ascending' ? 1 : -1;
//                 if (valB === undefined || valB === null) return sortConfig.direction === 'ascending' ? -1 : 1;

//                 if (typeof valA === 'number' && typeof valB === 'number') {
//                     return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
//                 }
                
//                 const strA = String(valA).toLowerCase();
//                 const strB = String(valB).toLowerCase();

//                 if (strA < strB) return sortConfig.direction === 'ascending' ? -1 : 1;
//                 if (strA > strB) return sortConfig.direction === 'ascending' ? 1 : -1;
//                 return 0;
//             });
//         }
//         return sortableFactures;
//     }, [facturesBrutes, filterText, filterStatus, sortConfig]);

//     const handleSaveFacture = async (factureData) => {
//         if (!facturesCollectionPath) return;
//         try {
//             const dataToSave = {
//                 ...factureData,
//                 dateEmission: new Date(factureData.dateEmission),
//                 dateEcheance: factureData.dateEcheance ? new Date(factureData.dateEcheance) : null,
//                 items: factureData.items.map(item => ({
//                     ...item,
//                     quantite: parseFloat(item.quantite) || 0,
//                     prixUnitaire: parseFloat(item.prixUnitaire) || 0,
//                     type: item.type || 'Autre',
//                 })),
//                 tvaPourcentage: parseFloat(factureData.tvaPourcentage) || 0,
//                 montantPaye: parseFloat(factureData.montantPaye) || 0,
//             };

//             if (dataToSave.id) {
//                 const { id, ...finalDataToUpdate } = dataToSave;
//                 await updateDoc(doc(db, facturesCollectionPath, id), finalDataToUpdate);
//             } else { 
//                 const { id, ...finalData } = dataToSave;
//                 await addDoc(collection(db, facturesCollectionPath), finalData);
//             }
//             setIsFormModalOpen(false);
//         } catch (err) {
//             setError("Échec de la sauvegarde de la facture.");
//         }
//     };

//     const handleDeleteFacture = async (factureId) => {
//         if (!facturesCollectionPath) return;
//         if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
//             try {
//                 await deleteDoc(doc(db, facturesCollectionPath, factureId));
//             } catch (err) {
//                 setError("Échec de la suppression de la facture.");
//             }
//         }
//     };

//     if (!currentUserId) return <div className="p-6 bg-white rounded-xl shadow-lg text-center text-slate-500">Veuillez vous connecter pour accéder à cette section.</div>;

//     return (
//         // <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg min-h-screen">
//         //     <div className="flex justify-between items-center mb-8">
//         //         <h2 className="text-3xl font-bold text-slate-800">Gestion des Factures</h2>
//         //         <button onClick={() => setIsFormModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"><PlusIcon className="w-5 h-5 mr-2"/>Nouvelle Facture</button>
//         //     </div>
//         //     {/* Le reste de la logique d'affichage... */}
//         // </div>
//          <div className="p-4 md:p-6 bg-slate-50 rounded-xl shadow-lg min-h-screen">
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
//                 <h2 className="text-3xl font-bold text-slate-800 mb-4 sm:mb-0">Gestion des Factures</h2>
//                 <button
//                     onClick={() => handleOpenFormModal()}
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                 >
//                     <PlusIcon className="w-5 h-5 mr-2" /> Nouvelle Facture
//                 </button>
//             </div>

//             {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md relative mb-6 shadow" role="alert">
//                 <strong className="font-bold">Erreur: </strong>
//                 <span className="block sm:inline">{error}</span>
//                  <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
//                     <XMarkIcon className="w-5 h-5 text-red-700"/>
//                 </button>
//             </div>}

//             {isLoading ? (
//                 <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md">
//                     <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" />
//                     <p className="ml-4 text-slate-600 text-lg mt-4">Chargement des factures...</p>
//                 </div>
//             ) : (
//                 <FactureList
//                     factures={filteredAndSortedFactures}
//                     onEdit={handleOpenFormModal}
//                     onDelete={handleDeleteFacture}
//                     onView={handleOpenDetailModal}
//                     sortConfig={sortConfig}
//                     requestSort={requestSort}
//                     filterText={filterText}
//                     setFilterText={setFilterText}
//                     filterStatus={filterStatus}
//                     setFilterStatus={setFilterStatus}
//                 />
//             )}
//             <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={currentFacture?.id ? "Modifier la Facture" : "Créer une Nouvelle Facture"}>
//                 <FactureForm
//                     initialFacture={currentFacture}
//                     onSave={handleSaveFacture}
//                     onCancel={handleCloseFormModal}
//                     clients={clients} 
//                     communiquesEmissions={communiquesEmissions} 
//                 />
//             </Modal>

//             <Modal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} title="Détail de la Facture" size="3xl">
//                 {currentFacture && <FactureDetail facture={currentFacture} onClose={handleCloseDetailModal} />}
//             </Modal>
//         </div>
//     );
// }

