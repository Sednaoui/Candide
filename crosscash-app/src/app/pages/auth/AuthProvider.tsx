import React from 'react';

import { fakeAuthProvider } from './auth';

interface AuthContextType {
    user: string;
    signin: (user: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}

function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
    const [user, setUser] = React.useState<any>(null);

    const signin = (newUser: string, callback: VoidFunction) => fakeAuthProvider.signin(() => {
        setUser(newUser);
        callback();
    });

    const signout = (callback: VoidFunction) => fakeAuthProvider.signout(() => {
        setUser(null);
        callback();
    });

    const value = { user, signin, signout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

const AuthContext = React.createContext<AuthContextType>({
    user: '',
    signin: () => null,
    signout: () => null,
});

function useAuth(): AuthContextType {
    return React.useContext(AuthContext);
}

export {
    AuthProvider,
    useAuth,
};
