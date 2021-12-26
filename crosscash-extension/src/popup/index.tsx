import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
    MemoryRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import './index.css';
import App from './App';
import { AuthProvider } from './pages/auth/AuthProvider';
import {
    RequireAuth,
    Login,
} from './pages/auth/Login';
import ImportWallet from './pages/onboarding/ImportWallet';
import Wallet from './pages/Wallet';
import reportWebVitals from './reportWebVitals';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store.store}>
            <PersistGate loading={null} persistor={store.persistor}>
                <Router>
                    <AuthProvider>
                        <Routes>
                            <Route path="/" element={<App />} />
                            <Route path="import_wallet" element={<ImportWallet />} />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/wallet"
                                element={(
                                    <RequireAuth>
                                        <Wallet />
                                    </RequireAuth>
                                )} />
                        </Routes>
                    </AuthProvider>
                </Router>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
