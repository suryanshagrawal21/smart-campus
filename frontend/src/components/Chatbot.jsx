import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { faqKnowledgeBase, defaultResponse, greetings, suggestedQuestions } from '../utils/chatbotKnowledge';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Show greeting on first open
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];
            setMessages([{ type: 'bot', text: greeting }]);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const findBestMatch = (userInput) => {
        const input = userInput.toLowerCase().trim();
        
        for (const faq of faqKnowledgeBase) {
            const keywordMatch = faq.keywords?.some(keyword => {
                const kw = keyword.toLowerCase();
                return input.includes(kw) || input.includes(kw + 's') || input.includes(kw + 'ing') || input.includes(kw + 'ed');
            });
            if (keywordMatch) {
                return faq.responses[0];
            }
        }

        let bestMatch = null;
        let maxScore = 0;

        for (const faq of faqKnowledgeBase) {
            let score = 0;
            
            for (const pattern of faq.patterns) {
                const p = pattern.toLowerCase();
                if (input.includes(p) || input.includes(p + 's') || input.includes(p + 'ing') || input.includes(p + 'ed')) {
                    score += 2;
                }
            }

            if (score > maxScore) {
                maxScore = score;
                bestMatch = faq;
            }
        }

        if (maxScore >= 1) {
            return bestMatch.responses[0];
        }

        return defaultResponse;
    }

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage = { type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const botResponse = findBestMatch(inputValue);
            setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
            setIsTyping(false);
        }, 800);
    };

    const handleSuggestedQuestion = (question) => {
        setInputValue(question);
        handleSendMessage();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 animate-bounce"
                    aria-label="Open chat"
                >
                    <FiMessageCircle className="text-2xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        ?
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] glass-card shadow-2xl rounded-2xl flex flex-col z-50 animate-scale-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <FiMessageCircle className="text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold">Smart Campus Assistant</h3>
                                <p className="text-xs opacity-90">Always here to help!</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                            <FiX className="text-xl" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${message.type === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'dark:bg-slate-700 bg-gray-200 dark:text-gray-100 text-gray-800 rounded-bl-none'
                                        } whitespace-pre-line`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="dark:bg-slate-700 bg-gray-200 p-3 rounded-2xl rounded-bl-none">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Suggested Questions (only show initially) */}
                        {messages.length === 1 && (
                            <div className="space-y-2">
                                <p className="text-sm dark:text-gray-400 text-gray-600 font-medium">Try asking:</p>
                                {suggestedQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setInputValue(question);
                                            setTimeout(() => handleSendMessage(), 100);
                                        }}
                                        className="w-full text-left text-sm dark:bg-slate-700/50 bg-gray-100 dark:text-gray-300 text-gray-700 p-2 rounded-lg dark:hover:bg-slate-600 hover:bg-gray-200 transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t dark:border-gray-700 border-gray-200">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="flex-1 input-field px-4 py-2"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FiSend className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
