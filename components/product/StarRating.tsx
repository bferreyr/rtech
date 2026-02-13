'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

export function StarRating({
    rating,
    onChange,
    readonly = false,
    size = 'md',
    showValue = false,
}: StarRatingProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-8 h-8',
    };

    const handleClick = (value: number) => {
        if (!readonly && onChange) {
            onChange(value);
        }
    };

    const renderStar = (index: number) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isHalfFilled = starValue - 0.5 === rating;

        return (
            <button
                key={index}
                type="button"
                onClick={() => handleClick(starValue)}
                disabled={readonly}
                className={`
          ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
          transition-all duration-200
          ${!readonly && 'hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'}
        `}
                aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
                {isHalfFilled ? (
                    <div className="relative">
                        <Star
                            className={`${sizeClasses[size]} text-gray-600`}
                            fill="currentColor"
                        />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star
                                className={`${sizeClasses[size]} text-yellow-400`}
                                fill="currentColor"
                            />
                        </div>
                    </div>
                ) : (
                    <Star
                        className={`${sizeClasses[size]} ${isFilled
                                ? 'text-yellow-400'
                                : 'text-gray-600'
                            }`}
                        fill={isFilled ? 'currentColor' : 'none'}
                    />
                )}
            </button>
        );
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
            </div>
            {showValue && (
                <span className="ml-2 text-sm font-medium text-[color:var(--text-secondary)]">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
