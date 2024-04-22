import { useState, useEffect, useRef, useCallback } from 'react';

function useIsVisible<T extends HTMLElement = HTMLElement>(signal?: string) {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    const isElementVisible = useCallback((element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }, []);

    const checkVisibility = useCallback(() => {
        if (ref.current) {
            setIsVisible(isElementVisible(ref.current));
        }
    }, [setIsVisible, isElementVisible]);

    useEffect(() => {
        const handleScroll = () => {
            checkVisibility();
        };

        window.addEventListener('scroll', handleScroll);
        checkVisibility(); // Check visibility on mount

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [checkVisibility]);

    useEffect(() => {
        // Re-check visibility when the signal changes
        checkVisibility();
    }, [signal, checkVisibility]);

    return { ref, isVisible };
}

export default useIsVisible;
