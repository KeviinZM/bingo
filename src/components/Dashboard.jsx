import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import BingoBoard from './BingoBoard';
import { checkWin } from '../utils/winLogic';

import { getUserId } from '../utils/identity';

const Dashboard = () => {
    const [grids, setGrids] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get unique User ID
    const userId = getUserId();

    useEffect(() => {
        // Query ordered by createdAt desc to show newest first
        const q = query(collection(db, 'bingo_grids'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const gridsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGrids(gridsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleToggle = async (gridId, cellIndex, currentStatus) => {
        // Optimistic update omitted for simplicity, relying on real-time listener
        const gridToUpdate = grids.find(g => g.id === gridId);
        if (!gridToUpdate) return;

        const newCells = [...gridToUpdate.cells];
        newCells[cellIndex].isChecked = !currentStatus;

        const gridRef = doc(db, 'bingo_grids', gridId);
        try {
            await updateDoc(gridRef, { cells: newCells });
        } catch (err) {
            console.error("Error updating grid:", err);
            alert("Erreur de synchro !");
        }
    };

    const handleDelete = async (gridId) => {
        if (!confirm("Vraiment supprimer cette grille ?")) return;
        try {
            await deleteDoc(doc(db, 'bingo_grids', gridId));
        } catch (err) {
            console.error("Error deleting grid:", err);
            alert("Erreur de suppression !");
        }
    };

    const handleVote = async (gridId, cellIndex, voteType) => {
        const grid = grids.find(g => g.id === gridId);
        if (!grid) return;

        const newCells = [...grid.cells];
        const cell = newCells[cellIndex];

        // Initialize structures
        if (!cell.votes) cell.votes = { success: 1, fail: 1, unsure: 1 };
        if (!cell.voters) cell.voters = [];

        // Check if already voted for this cell
        if (cell.voters.includes(userId)) {
            alert("Tu as déjà voté pour cette case, petit tricheur !");
            return;
        }

        // Increment vote and record voter
        cell.votes[voteType] = (cell.votes[voteType] || 0) + 1;
        cell.voters.push(userId);

        const gridRef = doc(db, 'bingo_grids', gridId);
        try {
            await updateDoc(gridRef, { cells: newCells });
        } catch (err) {
            console.error("Error updating vote:", err);
        }
    };



    // Calculate scores and sort for leaderboard
    const rankedGrids = [...grids].map(g => ({
        ...g,
        score: checkWin(g.cells)
    })).sort((a, b) => b.score - a.score || a.createdAt?.seconds - b.createdAt?.seconds);

    if (loading) return <div className="text-center text-white mt-10">Chargement des grilles...</div>;

    return (
        <div className="space-y-12">
            {/* LEADERBOARD SECTION */}
            {grids.length > 0 && (
                <div className="bg-white/90 rounded-xl p-6 shadow-2xl border-4 border-yellow-400 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-black text-center mb-6 uppercase tracking-widest text-yellow-600 flex items-center justify-center gap-2">
                        🏆 Classement Général 🏆
                    </h3>
                    <div className="space-y-2">
                        {rankedGrids.map((grid, index) => (
                            <div
                                key={grid.id}
                                className={`flex items-center justify-between p-3 rounded-lg font-bold ${index === 0 ? 'bg-yellow-100 border-2 border-yellow-400 text-yellow-800 scale-105 shadow-md' :
                                    index === 1 ? 'bg-gray-100 border-2 border-gray-400 text-gray-700' :
                                        index === 2 ? 'bg-orange-100 border-2 border-orange-400 text-orange-800' :
                                            'bg-white border border-gray-200 text-gray-600'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-xl w-8 text-center font-black">#{index + 1}</span>
                                    <span className="uppercase">{grid.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{grid.score}</span>
                                    <span className="text-xs uppercase opacity-75 pt-1">Pts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* GRIDS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {grids.map(grid => (
                    <BingoBoard
                        key={grid.id}
                        grid={grid}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onVote={handleVote}
                    />
                ))}
            </div>

            {grids.length === 0 && (
                <div className="text-white col-span-full text-center italic opacity-75">
                    Pas encore de grilles. Sois le premier à en créer une !
                </div>
            )}
        </div>
    );
};

export default Dashboard;
