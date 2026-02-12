'use client';

import { Check } from 'lucide-react';

interface ProgressStep {
    id: string;
    label: string;
    completed: boolean;
}

interface ProgressIndicatorProps {
    steps: ProgressStep[];
    currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
    const progress = (currentStep / steps.length) * 100;

    return (
        <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Steps */}
            <div className="flex justify-between">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className="flex items-center gap-2"
                    >
                        <div
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center
                                transition-all duration-300
                                ${step.completed
                                    ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white'
                                    : index === currentStep
                                        ? 'bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] text-white'
                                        : 'bg-white/5 text-[hsl(var(--text-tertiary))]'
                                }
                            `}
                        >
                            {step.completed ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                            )}
                        </div>

                        <span
                            className={`
                                text-xs font-medium hidden sm:inline
                                ${step.completed || index === currentStep
                                    ? 'text-[hsl(var(--text-primary))]'
                                    : 'text-[hsl(var(--text-tertiary))]'
                                }
                            `}
                        >
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Progress Percentage */}
            <div className="text-center">
                <span className="text-sm text-[hsl(var(--text-secondary))]">
                    {Math.round(progress)}% completado
                </span>
            </div>
        </div>
    );
}
