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
                {cells.map((cell, idx) => {
                    const status = cell.status || (cell.isChecked ? 'success' : 'pending');
                    const isSuccess = status === 'success';
                    const isFailed = status === 'failed';
                    const userVote = cell.userVotes?.[currentUserId];

                    // Determine cell background color
                    let cellBg = 'bg-white text-gray-800';
                    if (isSuccess) cellBg = 'bg-green-500 text-white';
                    if (isFailed) cellBg = 'bg-red-500 text-white';

                    return (
                        <div key={idx} className="flex flex-col h-full bg-white gap-1 relative">
                            {/* Main Interaction Button */}
                            <button
                                onClick={() => onToggle(id, idx, cell.isChecked)}
                                className={`
                                    flex-1 w-full flex flex-col items-center justify-center p-1 text-xs font-bold text-center break-words select-none transition-all relative min-h-[5rem]
                                    ${cellBg} hover:opacity-90
                                `}
                            >
                                {cell.priority && (
                                    <span className={`absolute top-1 right-1 text-[9px] px-1 rounded-full ${isSuccess || isFailed ? 'bg-white text-black' : 'bg-yellow-400 text-black'}`}>
                                        ★{cell.priority}
                                    </span>
                                )}
                                <span>{cell.text}</span>
                                {isFailed && <span className="absolute bottom-1 font-black text-xs uppercase text-red-100">RATÉ</span>}
                            </button>

                            {/* Voting/Odds Section */}
                            <div className="grid grid-cols-3 text-[9px] border-t border-gray-100">
                                {['success', 'fail', 'unsure'].map(type => {
                                    // Calculate count from userVotes map
                                    const voteCount = Object.values(cell.userVotes || {}).filter(v => v === type).length;
                                    const icons = { success: '✅', fail: '❌', unsure: '🤔' };
                                    const titles = { success: 'Il va réussir', fail: 'Il va échouer', unsure: 'Ne sais pas' };
                                    const colors = {
                                        success: userVote === 'success' ? 'bg-green-200 text-green-800 border-green-500' : 'bg-green-50 text-green-700 hover:bg-green-100',
                                        fail: userVote === 'fail' ? 'bg-red-200 text-red-800 border-red-500' : 'bg-red-50 text-red-700 hover:bg-red-100',
                                        unsure: userVote === 'unsure' ? 'bg-gray-200 text-gray-800 border-gray-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    };

                                    return (
                                        <button
                                            key={type}
                                            onClick={() => status === 'pending' && onVote(id, idx, type)}
                                            disabled={status !== 'pending'}
                                            className={`
                                                p-1 flex flex-col items-center border-r border-gray-100 transition-colors
                                                ${colors[type]} ${userVote === type ? 'font-bold border-b-2' : ''}
                                                ${status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                            title={titles[type]}
                                        >
                                            <span>{icons[type]}</span>
                                            <span className="font-mono font-bold">{voteCount}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
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
