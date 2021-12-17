import { Duplex } from 'stream';

import { WindowPostMessageStream } from '@metamask/post-message-stream';
import * as log from 'loglevel';

import runApi from '../background/api';
import {
    INPAGE_STREAM, CONTENTSCRIPT_STREAM,
} from '../util/constants';

// TODO: temporary to demonstrate communication
// In window type window.stream.write('hey');
log.setLevel('debug');

export default function connectStreams(): void {
    // Sets up communication stream
    const stream = new WindowPostMessageStream({
        name: CONTENTSCRIPT_STREAM,
        target: INPAGE_STREAM,
    }) as unknown as Duplex; // @metamask/post-message-stream used wrong Duplex

    // TODO: temporary to demonstrate communication
    stream.on('data', (m) => {
        log.debug(m);
        runApi(m);
    });
}
