import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

import { getUserId } from '../utils/identity';

const CreateGrid = () => {
    const [name, setName] = useState('');
    const [inputs, setInputs] = useState(Array(9).fill({ text: '', priority: '' }));
    const [loading, setLoading] = useState(false);

    const handleInputChange = (index, field, value) => {
        const newInputs = [...inputs];
        // Handle direct string update (legacy) or object update
        if (typeof newInputs[index] === 'string') {
            newInputs[index] = { text: value, priority: '' };
        } else {
            newInputs[index] = { ...newInputs[index], [field]: value };
        }
        setInputs(newInputs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation: Check text and priority (1-9)
        const isValid = inputs.every(i =>
            i.text.trim() &&
            i.priority &&
            !isNaN(i.priority) &&
            i.priority >= 1 &&
            i.priority <= 9
        );

        if (!name.trim() || !isValid) {
            alert("Remplis tout ! (Objectif + Note de 1 à 9)");
            return;
        }

        setLoading(true);
        try {
            const cells = inputs.map(input => ({
                text: input.text,
                priority: parseInt(input.priority),
                status: 'pending', // Replaces isChecked. Values: pending, success, failed
                userVotes: {} // Map userId -> 'success' | 'fail' | 'unsure'
            }));
            await addDoc(collection(db, 'bingo_grids'), {
                name,
                cells,
                creatorId: getUserId(),
                createdAt: new Date()
            });
            // Reset form
            setName('');
            setInputs(Array(9).fill({ text: '', priority: '' }));
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Erreur lors de la création");
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl mb-8 border-2 border-indigo-100">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 font-mono">CRÉER UNE GRILLE</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1">TON BLAZE</label>
                    <input
                        className="w-full border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-indigo-500 font-mono"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder=""
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">LES CRITÈRES BINGO (9 cases)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {inputs.map((val, idx) => (
                            <div key={idx} className="flex gap-1">
                                <input
                                    className="flex-1 border-2 border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-indigo-500"
                                    value={val.text || ''}
                                    onChange={(e) => handleInputChange(idx, 'text', e.target.value)}
                                    placeholder={`Objectif ${idx + 1}`}
                                />
                                <input
                                    type="number"
                                    min="1"
                                    max="9"
                                    className="w-16 border-2 border-yellow-400 p-2 rounded text-center font-bold text-sm focus:outline-none focus:border-yellow-600"
                                    value={val.priority || ''}
                                    onChange={(e) => handleInputChange(idx, 'priority', e.target.value)}
                                    placeholder="1-9"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded transition-colors"
                >
                    {loading ? 'ENVOI...' : 'LANCER LA GAME'}
                </button>
            </form>
        </div>
    );
};

export default CreateGrid;
