import React from 'react';
import {
    useNavigate,
    useLocation,
    Navigate,
} from 'react-router-dom';

import {
    Button,
    Form,
} from '../../components';
import { useAuth } from './AuthProvider';

function Login(): React.ReactElement {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();

    // @ts-expect-error: This is a fake auth provider, so we can't actually sign in
    const from = location.state?.from?.pathname || '/wallet';

    return (
        <div>
            <header className='App-header'>
                <p>
                    Type your password to login into your wallet
                </p>
                <Form
                    className="mb-3"
                    onSubmit={
                        (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const username = formData.get('password') as string;

                            auth.signin(username, () => {
                                navigate(from, { replace: true });
                            });
                        }
                    }>
                    <input name="password" type="password" />
                    {' '}
                    <Button
                        type="submit"
                        className='mt-3'>
                        Login
                    </Button>
                </Form>
            </header>
        </div>
    );
}

function RequireAuth({ children }: { children: JSX.Element }): React.ReactElement {
    const auth = useAuth();
    const location = useLocation();

    if (!auth.user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
}

export {
    Login,
    RequireAuth,
};
