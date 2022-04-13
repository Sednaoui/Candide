import {
    useState,
    useEffect,
} from 'react';

export function useWindowWidth() {
    const [matches, setMatches] = useState(0);

    useEffect(() => {
        setMatches(window.innerWidth);
    }, [matches]);

    return matches;
}
