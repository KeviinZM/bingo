import { checkWin } from '../utils/winLogic';

const BingoBoard = ({ grid, currentUserId, onToggle, onDelete, onVote }) => {
    const { id, name, cells, creatorId } = grid;
    const score = checkWin(cells);
    const isCreator = creatorId === currentUserId;

    const calculateOdds = (votes, type) => {
        const v = votes || { success: 1, fail: 1, unsure: 1 };
        const total = (v.success || 1) + (v.fail || 1) + (v.unsure || 1);
        // Cote = Total / Votes pour ce choix
        const val = total / (v[type] || 1);
        return val.toFixed(2);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-black transform transition hover:scale-105 duration-200 relative group">
            {/* Action Buttons: Delete & Share */}
            <div className="absolute top-0 right-0 flex z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const text = `🔥 Regarde ma grille Bingo 2026 "${name}" !`;
                        const url = window.location.href;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                    }}
                    className="bg-green-500 text-white w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-600"
                    title="Partager sur WhatsApp"
                >
                    W
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Discord usually implies copying the link
                        const text = `**Bingo 2026** : Regarde la grille de ${name} !\n${window.location.href}`;
                        navigator.clipboard.writeText(text);
                        alert("Lien copié pour Discord !");
                    }}
                    className="bg-indigo-500 text-white w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600"
                    title="Copier pour Discord"
                >
                    D
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                    className="bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all border-2 border-white"
                    title="Supprimer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div className="bg-black text-white p-2 text-center font-mono font-bold uppercase flex justify-between px-4 mt-4">
                <span>{name}</span>
                <span className="text-yellow-400">SCORE: {score}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-gray-200 p-1">
                {cells.map((cell, idx) => (
                    <div key={idx} className="flex flex-col h-full bg-white gap-1">
                        {/* Main Interaction Button */}
                        <button
                            onClick={() => onToggle(id, idx, cell.isChecked)}
                            className={`
                                flex-1 w-full flex flex-col items-center justify-center p-1 text-xs font-bold text-center break-words select-none transition-all relative min-h-[5rem]
                                ${cell.isChecked
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white text-gray-800 hover:bg-gray-50'}
                            `}
                        >
                            {cell.priority && (
                                <span className={`absolute top-1 right-1 text-[9px] px-1 rounded-full ${cell.isChecked ? 'bg-white text-green-600' : 'bg-yellow-400 text-black'}`}>
                                    ★{cell.priority}
                                </span>
                            )}
                            <span>{cell.text}</span>
                        </button>

                        {/* Voting/Odds Section */}
                        <div className="grid grid-cols-3 text-[9px] border-t border-gray-100">
                            <button
                                onClick={() => onVote(id, idx, 'success')}
                                className="bg-green-50 hover:bg-green-100 text-green-700 p-1 flex flex-col items-center border-r border-gray-100"
                                title="Il va réussir"
                            >
                                <span>✅</span>
                                <span className="font-mono font-bold">{calculateOdds(cell.votes, 'success')}</span>
                            </button>
                            <button
                                onClick={() => onVote(id, idx, 'fail')}
                                className="bg-red-50 hover:bg-red-100 text-red-700 p-1 flex flex-col items-center border-r border-gray-100"
                                title="Il va échouer"
                            >
                                <span>❌</span>
                                <span className="font-mono font-bold">{calculateOdds(cell.votes, 'fail')}</span>
                            </button>
                            <button
                                onClick={() => onVote(id, idx, 'unsure')}
                                className="bg-gray-50 hover:bg-gray-100 text-gray-600 p-1 flex flex-col items-center"
                                title="Ne sais pas"
                            >
                                <span>🤔</span>
                                <span className="font-mono font-bold">{calculateOdds(cell.votes, 'unsure')}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {score > 0 && (
                <div className="bg-yellow-400 text-black text-center font-bold text-xs py-1 animate-pulse">
                    BINGO ! ({score} PTS)
                </div>
            )}
        </div>
    );
};

export default BingoBoard;
