import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full border-l-8 border-red-500">
                        <h1 className="text-3xl font-black text-red-600 mb-4">💥 Oups ! Ça a planté.</h1>
                        <p className="mb-4 text-gray-700 font-bold">Voici l'erreur exacte (fais une capture d'écran ou copie ça) :</p>

                        <div className="bg-gray-900 text-red-300 p-4 rounded-lg overflow-auto text-sm font-mono mb-6 max-h-64">
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-lg transition-colors"
                        >
                            🔄 Recharger la page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
