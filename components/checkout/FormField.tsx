'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { FieldState } from '@/lib/checkout-validation';

interface BaseFieldProps {
    label: string;
    error?: string;
    fieldState?: FieldState;
    required?: boolean;
    icon?: React.ReactNode;
}

type InputFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement> & {
    type?: 'text' | 'email' | 'tel' | 'number';
};

type TextareaFieldProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const FormField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, fieldState = 'idle', required, icon, className, ...props }, ref) => {
        const getStateStyles = () => {
            switch (fieldState) {
                case 'valid':
                    return 'border-green-400 focus:border-green-400';
                case 'invalid':
                    return 'border-red-400 focus:border-red-400';
                case 'validating':
                    return 'border-yellow-400 focus:border-yellow-400';
                case 'typing':
                    return 'border-blue-400 focus:border-blue-400';
                default:
                    return 'border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))]';
            }
        };

        const getStateIcon = () => {
            switch (fieldState) {
                case 'valid':
                    return <Check className="w-5 h-5 text-green-400" />;
                case 'invalid':
                    return <X className="w-5 h-5 text-red-400" />;
                case 'validating':
                    return <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />;
                default:
                    return null;
            }
        };

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>

                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-secondary))]">
                            {icon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={`
                            w-full px-4 py-3 rounded-lg 
                            bg-[hsl(var(--bg-tertiary))] 
                            border-2 
                            ${getStateStyles()}
                            ${icon ? 'pl-10' : ''}
                            ${fieldState !== 'idle' ? 'pr-10' : ''}
                            focus:outline-none 
                            transition-all duration-200
                            ${className || ''}
                        `}
                        {...props}
                    />

                    {fieldState !== 'idle' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {getStateIcon()}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = 'FormField';

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
    ({ label, error, fieldState = 'idle', required, icon, className, ...props }, ref) => {
        const getStateStyles = () => {
            switch (fieldState) {
                case 'valid':
                    return 'border-green-400 focus:border-green-400';
                case 'invalid':
                    return 'border-red-400 focus:border-red-400';
                default:
                    return 'border-[hsl(var(--border-color))] focus:border-[hsl(var(--accent-primary))]';
            }
        };

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>

                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-3 text-[hsl(var(--text-secondary))]">
                            {icon}
                        </div>
                    )}

                    <textarea
                        ref={ref}
                        className={`
                            w-full px-4 py-3 rounded-lg 
                            bg-[hsl(var(--bg-tertiary))] 
                            border-2 
                            ${getStateStyles()}
                            ${icon ? 'pl-10' : ''}
                            focus:outline-none 
                            transition-all duration-200
                            resize-none
                            ${className || ''}
                        `}
                        {...props}
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

TextareaField.displayName = 'TextareaField';
