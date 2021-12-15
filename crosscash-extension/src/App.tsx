import logo from './logo.svg';
import './App.css';
import store from './store';
import { createWalletAction } from './store/wallet/actions';

function App(): JSX.Element {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit
                    {' '}
                    <code>
                        src/App.js
                    </code>
                    {' '}
                    and save to reload.
                </p>
                <button
                    type="button"
                    onClick={() => store.store.dispatch(createWalletAction())}>
                    Create wallet
                </button>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
