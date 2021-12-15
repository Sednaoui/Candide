import assert from 'assert';

import { createWallet } from '../wallet';

describe('import valid mnemonic', () => {
    const mnemonic = 'there night cash clap pottery cereal silly silent hybrid hour visual hurry';
    const expectedAddress = '0x41f99409865FB23b833C1cD40C1c03BDd3E2C575';

    it('should return a valid wallet', async () => {
        const wallet = await createWallet(mnemonic);

        if (wallet) {
            assert.equal(wallet.mnemonic.phrase, mnemonic);
            assert.equal(wallet.address, expectedAddress);
        }
    });
});

describe('import bad mneomic phrase', () => {
    const badMnemonic = 'there night cash 78h23nds';

    it('should return error', async () => {
        const wallet = await createWallet(badMnemonic);

        assert(wallet === null);
    });
});

describe('create new wallet', () => {
    it('should return a valid wallet', async () => {
        const wallet = await createWallet();

        assert(wallet !== null);
        assert(wallet.mnemonic !== null);
        assert(wallet.address !== null);
    });
});
