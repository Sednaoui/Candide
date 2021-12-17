import log from 'loglevel';

interface Params { }

// eslint-disable-next-line camelcase
export default function eth_getBalance(_params: Params): void {
    log.error('Crosscash: "eth_getBalance" method is not implemented');
}
