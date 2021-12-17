import log from 'loglevel';

interface Params { }

// eslint-disable-next-line camelcase
export default function eth_sendTransaction(_params: Params): void {
    log.error('Crosscash: "eth_sendTransaction" method is not implemented');
}
