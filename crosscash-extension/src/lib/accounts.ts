import { AnyAssetAmount } from './assets';
import { Network } from './networks';

/**
 * Named type for strings that should be hexadecimal numbers.
 *
 * Currently *does not offer type safety*, just documentation value; see
 * https://github.com/microsoft/TypeScript/issues/202 and
 * https://github.com/microsoft/TypeScript/issues/41160 for TS features that
 * would give this some more teeth. Right now, any `string` can be assigned
 * into a variable of type `HexString` and vice versa.
 */
export type HexString = string;

/**
 * An address on a particular network. That's it. That's the comment.
 */
export type AddressNetwork = {
    address: HexString
    network: Network
}

export type AccountBalance = {
    /**
     * The address whose balance was measured.
     */
    address: HexString;
    /**
     * The measured balance and the asset in which it's denominated.
     */
    assetAmount: AnyAssetAmount
    /**
     * The network on which the account balance was measured.
     */
    network: Network
    /**
     * The block height at while the balance measurement is valid.
     */
    blockHeight?: bigint
    /**
     * When the account balance was measured, using Unix epoch timestamps.
     */
    retrievedAt: number
    /**
     * A loose attempt at tracking balance data provenance, in case providers
     * disagree and need to be disambiguated.
     */
    dataSource: 'alchemy' | 'local'
}
