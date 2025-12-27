import CreateGrid from './components/CreateGrid';
import Dashboard from './components/Dashboard';
import Rules from './components/Rules';

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-md tracking-tighter transform -rotate-2">
                        League of Raté Bingo 2026
                    </h1>
                </header>

                <CreateGrid />

                <div className="my-8 border-t border-white/20"></div>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest border-l-4 border-yellow-400 pl-4">
                        Les Grilles en Direct
                    </h2>
                    <Dashboard />
                </section>

                <div className="my-8"></div>
                <Rules />
            </div>
        </div>
    );
}

export default App;
