
import { HexString } from './accounts';
import {
    Network,
    NetworkSpecific,
    SmartContract,
} from './networks';

/**
 * A reference to a token list, with the name, URL, and potentially logo of the
 * list. Used to track the one or more token lists that include a given asset's
 * metadata.
 */
export type TokenListCitation = {
    name: string
    url: string
    logoURL?: string
}

/**
 * Metadata for a given asset, as well as the one or more token lists that
 * provided that metadata.
 *
 * Note that the metadata is entirely optional.
 */
export type AssetMetadata = {
    coinGeckoID?: string
    logoURL?: string
    websiteURL?: string
    tokenLists: TokenListCitation[]
}

/**
 * The name and symbol of an arbitrary asset, fungible or non-fungible,
 * alongside potential metadata about that asset.
 */
export type Asset = {
    decimals: number,
    symbol: string
    name: string
    address?: HexString,
    metadata?: AssetMetadata
}

/**
 * Any asset that exists on a particular network; see {@link NetworkSpecific)
 * for information on network-specific objects.
 */
export type NetworkSpecificAsset = NetworkSpecific & Asset

/*
 * Fungible assets include coins, currencies, and many tokens.
 */
export type FungibleAsset = Asset & {
    decimals: number
}

/**
 * A simple alias for FungibleAsset to denote types that are expected to be
 * fiat currencies, typically used outside of the cryptocurrency world.
 *
 * Currently *does not offer type safety*, just documentation value; see
 * https://github.com/microsoft/TypeScript/issues/202 and for a TS feature that
 * would give this some more teeth. Right now, any `FiatCurrency` can be assigned
 * to any `FungibleAsset` and vice versa.
 */
export type FiatCurrency = FungibleAsset

/**
 * Any fungible asset that is managed by a smart contract; see
 * {@link SmartContract) for information on smart contract objects.
 */
export type SmartContractFungibleAsset = FungibleAsset & SmartContract

/*
 * A union of all assets we expect to price.
 */
export type AnyAsset =
    | Asset
    | NetworkSpecificAsset
    | FiatCurrency
    | FungibleAsset
    | SmartContractFungibleAsset

/*
 * The primary type representing amounts in fungible asset transactions.
 */
export type AnyAssetAmount = {
    asset: AnyAsset
    amount: number
}

/*
 * The primary type representing amounts in fungible or non-fungible asset
 * transactions.
 */
export type AssetAmount = {
    asset: Asset
    amount: bigint
}

/**
 * An object representing a transfer of an asset from one address to another.
 * Includes information on where the information on the transfer was found, as
 * well as the transaction that executed the transfer.
 */
export type AssetTransfer = {
    network: Network
    assetAmount: AssetAmount
    from: HexString
    to: HexString
    dataSource: 'alchemy' | 'local'
    txHash: string
}

export type AnyAssetTransfer = {
    network: Network
    assetAmount: AnyAssetAmount
    from: HexString
    to: HexString
    dataSource: 'alchemy' | 'local'
    txHash: string
}
