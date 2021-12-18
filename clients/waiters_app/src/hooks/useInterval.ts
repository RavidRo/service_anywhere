import {useEffect, useRef} from 'react';

// See: https://overreacted.io/making-setinterval-declarative-with-react-hooks/

export default function useInterval(
    callback: () => void,
    delay: number | null | undefined,
) {
    const savedCallback = useRef<() => void>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current?.();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
