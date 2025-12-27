import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getUserId } from '../utils/identity';

const NameModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem('bingo_user_name');
        if (!storedName) {
            setIsOpen(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        const userId = getUserId(); // Ensure we have an ID

        try {
            // Save to localStorage
            localStorage.setItem('bingo_user_name', name.trim());

            // Save to Firestore
            await setDoc(doc(db, 'bingo_users', userId), {
                name: name.trim(),
                createdAt: new Date()
            });

            setIsOpen(false);
        } catch (err) {
            console.error("Error saving name to Firestore:", err);
            // Show explicit error message to user
            alert(`Erreur de sauvegarde ! Vérifie ta connexion ou les règles Firestore.\nCode: ${err.code}\nMessage: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full border-4 border-indigo-500 animate-[bounceIn_0.5s_ease-out]">
                <h2 className="text-2xl font-black text-center text-indigo-600 mb-6 uppercase tracking-wider">
                    👋 C'est quoi ton blaze ?
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Choisis ton pseudo pour le classement :
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Le Roi du Bingo"
                            maxLength={15}
                            className="w-full p-3 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none text-center font-bold text-lg"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? 'Sauvegarde...' : 'VALIDER MON NOM 🚀'}
                    </button>

                    <p className="text-xs text-center text-gray-400">
                        (Tu ne pourras pas le changer facilement, choisis bien !)
                    </p>
                </form>
            </div>
        </div>
    );
};

export default NameModal;
