import assert from 'assert';

import {
    createWallet,
    createEncryptedWallet,
    decryptWallet,
} from '../wallet';

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

// encrypt valid wallet
describe('encrypt wallet', () => {
    const password = 'myveryscretpassword';
    const mnemonic = 'there night cash clap pottery cereal silly silent hybrid hour visual hurry';
    const expectedAddress = '0x41f99409865FB23b833C1cD40C1c03BDd3E2C575';

    it('should return a valid wallet', async () => {
        const wallet = await createEncryptedWallet(password, mnemonic);

        if (wallet) {
            assert.equal(wallet.address, expectedAddress);
            assert.notEqual(wallet.mnemonic.phrase, mnemonic);
        }
    });
});

// encrypt bad wallet
describe('encrypt bad wallet', () => {
    const password = 'myveryscretpassword';
    const badMnemonic = 'there hello world cash 78h23nds';

    it('should return error', async () => {
        const wallet = await createEncryptedWallet(password, badMnemonic);

        assert(wallet === null);
    });
});

// descrypt a valid wallet
describe('decrypt wallet', () => {
    const password = 'myveryscretpassword';
    const mnemonic = 'there night cash clap pottery cereal silly silent hybrid hour visual hurry';
    const expectedAddress = '0x41f99409865FB23b833C1cD40C1c03BDd3E2C575';

    it('should return a valid wallet', async () => {
        const encryptedWallet = await createEncryptedWallet(password, mnemonic);

        if (encryptedWallet) {
            const wallet = await decryptWallet(password, encryptedWallet);

            if (wallet) {
                assert.equal(wallet.address, expectedAddress);
                assert.equal(wallet.mnemonic.phrase, mnemonic);
            }
        }
    });
});
