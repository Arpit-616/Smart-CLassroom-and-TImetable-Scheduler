import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
            {title && (
                <div className="p-4 border-b border-slate-200 flex items-center space-x-3">
                    {icon && <span className="text-primary">{icon}</span>}
                    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                </div>
            )}
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};

export default Card;