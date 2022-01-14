import { HexString } from './accounts';

// Should be structurally compatible with FungibleAsset or much code will
// likely explode.
type NetworkBaseAsset = {
    symbol: string
    name: string
    decimals: number
}

/**
 * Each supported network family is generally incompatible with others from a
 * transaction, consensus, and/or wire format perspective.
 */
export type NetworkFamily = 'EVM' | 'BTC'

/**
 * Represents a cryptocurrency network; these can potentially be L1 or L2.
 */
export type Network = {
    name: string
    baseAsset: NetworkBaseAsset
    family: NetworkFamily
    chainID?: string
}

/**
 * Mixed in to any other type, gives it the property of belonging to a
 * particular network. Often used to delineate contracts or assets that are on
 * a single network to distinguish from other versions of them on different
 * networks.
 */
export type NetworkSpecific = {
    homeNetwork: Network
}

/**
 * A smart contract on any network that tracks smart contracts via a hex
 * contract address.
 */
export type SmartContract = NetworkSpecific & {
    contractAddress: HexString
}

/**
 * An EVM-style network which *must* include a chainID.
 */
export type EVMNetwork = Network & {
    chainID: string
    family: 'EVM'
}

