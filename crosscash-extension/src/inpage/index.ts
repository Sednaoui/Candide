import { Duplex } from 'stream';

import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { initializeProvider } from '@metamask/providers/dist/initializeInpageProvider';
import * as log from 'loglevel';

import {
    INPAGE_STREAM, CONTENTSCRIPT_STREAM,
} from '../util/constants';

declare global {
  interface Window {
    stream: Duplex;
  }
}

// TODO: temporary to demonstrate communication
// Initializes communication to extension
window.stream = new WindowPostMessageStream({
    name: INPAGE_STREAM,
    target: CONTENTSCRIPT_STREAM,
}) as unknown as Duplex; // @metamask/post-message-stream used wrong Duplex

// Initializes the window.ethereum object
initializeProvider({
    connectionStream: window.stream,
    logger: log,
    shouldShimWeb3: true,
});
