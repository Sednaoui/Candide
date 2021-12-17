import log from 'loglevel';

interface Params { }

// eslint-disable-next-line camelcase
export default function eth_sign(_params: Params): void {
    log.error('Crosscash: "eth_sign" method is not implemented');
}
