"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function TailwindToast({
    title,
    description,
    duration = 3000,
    onClose,
}) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);
        return () => clearTimeout(timeout);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <div className="bg-white border border-gray-300 shadow-lg rounded-xl p-4 max-w-sm w-full flex items-start space-x-3 animate-slide-in">
                <div className="flex-1">
                    <p className="font-semibold text-gray-900">{title}</p>
                    {description && (
                        <p className="text-sm text-gray-700 mt-1">
                            {description}
                        </p>
                    )}
                </div>
                <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                        setVisible(false);
                        if (onClose) onClose();
                    }}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
