const Rules = () => {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 text-white border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-yellow-300 border-b border-white/20 pb-2">
                📜 Règles du Jeu
            </h3>
            <div className="space-y-4 text-sm md:text-base font-light leading-relaxed">
                <p>
                    <strong className="text-white font-bold">🎯 Objectif :</strong> Chacun choisit <span className="text-yellow-300 font-bold">9 objectifs</span> à réaliser sur toute l’année 2026.
                </p>

                <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-indigo-200">🛠️ Construction de la grille</h4>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Définis tes 9 objectifs personnels.</li>
                        <li>Classe-les sous forme de <strong>tier-list</strong> <span className="italic opacity-75">(1 = Priorité absolue / 9 = Le moins prioritaire)</span>.</li>
                    </ul>
                </div>

                <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-indigo-200">🔮 Les Pronostics (Cotes)</h4>
                    <p className="mb-2">Les autres participants parient sur tes objectifs :</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs md:text-sm font-mono">
                        <div className="bg-green-500/20 border border-green-500/50 p-2 rounded">
                            <span className="block text-xl">1</span>
                            "Il va gérer"
                        </div>
                        <div className="bg-red-500/20 border border-red-500/50 p-2 rounded">
                            <span className="block text-xl">2</span>
                            "Il va se foirer"
                        </div>
                        <div className="bg-gray-500/20 border border-gray-500/50 p-2 rounded">
                            <span className="block text-xl">N</span>
                            "Je sais pas"
                        </div>
                    </div>
                </div>

                <p className="italic opacity-75 text-xs text-center border-t border-white/10 pt-2">
                    📅 Le classement est mis à jour chaque dernier jour du mois.
                </p>
            </div>
        </div>
    );
};

export default Rules;
