export default function Footer() {
    return (
        <footer className="w-full py-6 border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-6">
                    <a
                        href="https://siddhant.space"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Portfolio
                    </a>
                    <a
                        href="https://github.com/siddhantdas18"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
} 