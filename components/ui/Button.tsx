import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
    // Fix: Add size prop to allow for different button sizes and fix TS error.
    size?: 'sm' | 'md';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    // Fix: Add size prop with 'md' as default.
    size = 'md',
    leftIcon,
    rightIcon,
    className = '',
    ...props
}) => {
    // Fix: Remove size-specific styling from baseClasses to be handled by the size prop.
    const baseClasses = 'inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500',
        secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-500',
        success: 'bg-success text-white hover:bg-success-600 focus:ring-success-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-primary-500 border-slate-300',
    };

    // Fix: Add classes for different button sizes.
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-4 py-2 text-sm',
    };

    return (
        <button
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {leftIcon && <span className="mr-2 -ml-1 h-5 w-5">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 -mr-1 h-5 w-5">{rightIcon}</span>}
        </button>
    );
};

export default Button;