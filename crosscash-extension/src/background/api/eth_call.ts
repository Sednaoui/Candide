import log from 'loglevel';

interface Params { }

// eslint-disable-next-line camelcase
export default function eth_call(_params: Params): void {
    log.error('Crosscash: "eth_call" method is not implemented');
}
