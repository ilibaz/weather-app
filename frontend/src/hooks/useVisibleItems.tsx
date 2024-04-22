import { useEffect, useState } from 'react';

function useVisibleItems(containerRef: React.RefObject<HTMLElement>) {
    const [visibleItems, setVisibleItems] = useState<Element[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const container = containerRef.current;
            updateVisibleItems(container);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [containerRef]);

    useEffect(() => {
        // Initial update on mount
        if (containerRef.current) {
            const container = containerRef.current;
            updateVisibleItems(container);
        }
    }, [containerRef]);

    const updateVisibleItems = (container: HTMLElement) => {
        const items = container.children;
        const visibleItemsArray = Array.from(items).filter(item => {
            const rect = item.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= window.innerHeight;
        });
        setVisibleItems(visibleItemsArray);
    };

    return visibleItems;
}

export default useVisibleItems;
