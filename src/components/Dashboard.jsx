import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import BingoBoard from './BingoBoard';
import { checkWin } from '../utils/winLogic';

import { getUserId } from '../utils/identity';

const Dashboard = () => {
    const [grids, setGrids] = useState([]);
    const [users, setUsers] = useState({});
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

        // Listen for users updates
        const unsubscribeUsers = onSnapshot(collection(db, 'bingo_users'), (snapshot) => {
            const usersData = {};
            snapshot.docs.forEach(doc => {
                usersData[doc.id] = doc.data().name;
            });
            setUsers(usersData);
        });

        return () => {
            unsubscribe();
            unsubscribeUsers();
        };
    }, []);

    const handleToggle = async (gridId, cellIndex, currentStatus) => {
        const gridToUpdate = grids.find(g => g.id === gridId);
        if (!gridToUpdate) return;

        const newCells = [...gridToUpdate.cells];
        const cell = newCells[cellIndex];

        // Cycle: pending -> success -> failed -> pending
        let nextStatus = 'pending';
        const current = cell.status || (cell.isChecked ? 'success' : 'pending');

        if (current === 'pending') nextStatus = 'success';
        else if (current === 'success') nextStatus = 'failed';
        else if (current === 'failed') nextStatus = 'pending';

        // Update both for compatibility
        cell.status = nextStatus;
        cell.isChecked = (nextStatus === 'success');

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
        if (!cell.userVotes) cell.userVotes = {};

        // Update specific user vote
        cell.userVotes[userId] = voteType;

        const gridRef = doc(db, 'bingo_grids', gridId);
        try {
            await updateDoc(gridRef, { cells: newCells });
        } catch (err) {
            console.error("Error updating vote:", err);
        }
    };

    // Calculate Bettor Scores
    const calculateBettorScores = (allGrids) => {
        const scores = {}; // userId -> score

        allGrids.forEach(grid => {
            grid.cells.forEach(cell => {
                const status = cell.status || (cell.isChecked ? 'success' : 'pending');
                const votes = cell.userVotes || {};

                Object.entries(votes).forEach(([voterId, vote]) => {
                    if (!scores[voterId]) scores[voterId] = 0;

                    // Point if Success and voted 'success'
                    if (status === 'success' && vote === 'success') {
                        scores[voterId] += 1;
                    }
                    // Point if Failed and voted 'fail'
                    else if (status === 'failed' && vote === 'fail') {
                        scores[voterId] += 1;
                    }
                });
            });
        });

        // Convert to array and sort
        return Object.entries(scores)
            .map(([uid, score]) => ({ id: uid, score }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Top 5
    };

    const topBettors = calculateBettorScores(grids);



    // Calculate scores and sort for leaderboard
    const rankedGrids = [...grids].map(g => ({
        ...g,
        score: checkWin(g.cells)
    })).sort((a, b) => b.score - a.score || a.createdAt?.seconds - b.createdAt?.seconds);

    if (loading) return <div className="text-center text-white mt-10">Chargement des grilles...</div>;

    return (
        <div className="space-y-12">
            {/* LEADERBOARD SECTION */}
            {/* LEADERBOARDS SECTION */}
            {grids.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* PLAYER LEADERBOARD */}
                    <div className="bg-white/90 rounded-xl p-6 shadow-2xl border-4 border-yellow-400">
                        <h3 className="text-2xl font-black text-center mb-6 uppercase tracking-widest text-yellow-600 flex items-center justify-center gap-2">
                            🏆 Classement Joueurs 🏆
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

                    {/* BETTOR LEADERBOARD */}
                    <div className="bg-white/90 rounded-xl p-6 shadow-2xl border-4 border-indigo-400">
                        <h3 className="text-2xl font-black text-center mb-6 uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-2">
                            🔮 Meilleurs Parieurs 🔮
                        </h3>
                        <div className="space-y-2">
                            {topBettors.length === 0 ? (
                                <div className="text-center italic opacity-50 py-4">Pas encore de paris validés...</div>
                            ) : (
                                topBettors.map((bettor, index) => {
                                    const userName = users[bettor.id] || `Anonyme (${bettor.id.substr(0, 4)}...)`;
                                    return (
                                        <div
                                            key={bettor.id}
                                            className={`flex items-center justify-between p-3 rounded-lg font-bold ${index === 0 ? 'bg-indigo-100 border-2 border-indigo-400 text-indigo-800 scale-105 shadow-md' :
                                                'bg-white border border-gray-200 text-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl w-8 text-center font-black">#{index + 1}</span>
                                                <span className="uppercase font-mono text-sm truncate max-w-[8rem] sm:max-w-[12rem]">{userName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{bettor.score}</span>
                                                <span className="text-xs uppercase opacity-75 pt-1">Pts</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* GRIDS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {grids.map(grid => (
                    <BingoBoard
                        key={grid.id}
                        grid={grid}
                        currentUserId={userId} // Pass userId for determining own vote
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
