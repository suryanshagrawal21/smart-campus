import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThreeBackground = () => {
    const { isDark } = useTheme();

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden opacity-30">
            {isDark ? (
                <>
                    <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-600 to-purple-800 rounded-full blur-3xl animate-blob top-0 -left-4"></div>
                    <div className="absolute w-96 h-96 bg-gradient-to-br from-purple-600 to-pink-700 rounded-full blur-3xl animate-blob animation-delay-2000 top-0 -right-4"></div>
                    <div className="absolute w-96 h-96 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-full blur-3xl animate-blob animation-delay-4000 -bottom-8 left-20"></div>
                </>
            ) : (
                <>
                    <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl animate-blob top-0 -left-4"></div>
                    <div className="absolute w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl animate-blob animation-delay-2000 top-0 -right-4"></div>
                    <div className="absolute w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl animate-blob animation-delay-4000 -bottom-8 left-20"></div>
                </>
            )}
        </div>
    );
};

export default ThreeBackground;
