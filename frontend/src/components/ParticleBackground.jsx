import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ParticleBackground = () => {
    const { isDark } = useTheme();

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Animated gradient orbs */}
            {isDark ? (
                <>
                    <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-indigo-700 to-purple-800 rounded-full blur-3xl opacity-25 animate-blob top-20 left-10"></div>
                    <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-cyan-600 to-blue-700 rounded-full blur-3xl opacity-25 animate-blob animation-delay-2000 top-40 right-10"></div>
                    <div className="absolute w-[450px] h-[450px] bg-gradient-to-br from-pink-600 to-purple-700 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-20 left-1/3"></div>
                </>
            ) : (
                <>
                    <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-blob top-20 left-10"></div>
                    <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000 top-40 right-10"></div>
                    <div className="absolute w-[450px] h-[450px] bg-gradient-to-br from-pink-300 to-purple-400 rounded-full blur-3xl opacity-15 animate-blob animation-delay-4000 bottom-20 left-1/3"></div>
                </>
            )}

            {/* Floating particles */}
            <div className="particles-container">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`particle ${isDark ? 'bg-white' : 'bg-gray-800'}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${10 + Math.random() * 10}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ParticleBackground;
