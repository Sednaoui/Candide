import { HexString } from './accounts';

/**
 * An estimate of the confidence that a given set of gas price parameters
 * will result in the inclusion of a transaction in the next block.
 */
export type BlockEstimate = {
    confidence: number
    /**
     * For legacy (pre-EIP1559) transactions, the gas price that results in the
     * above likelihood of inclusion.
     */
    price: bigint
    /**
     * For EIP1559 transactions, the max priority fee per gas that results in the
     * above likelihood of inclusion.
     */
    maxPriorityFeePerGas: bigint
    /**
     * For EIP1559 transactions, the max fee per gas that results in the above
     * likelihood of inclusion.
     */
    maxFeePerGas: bigint
}

/**
 * The estimated gas prices for including a transaction in the next block.
 *
 * The estimated prices include a percentage (confidence) that a transaction with
 * the given `baseFeePerGas` will be included in the next block.
 */
export type BlockPrices = {
    network: Network
    blockNumber: number
    baseFeePerGas: bigint
    /**
     * An estimate of how many transactions will be included in the next block.
     */
    estimatedTransactionCount: number | null
    /**
     * A choice of gas price parameters with associated confidence that a
     * transaction using those parameters will be included in the next block.
     */
    estimatedPrices: BlockEstimate[]
    /**
     * Whether these prices were estimated locally or via a third party provider
     */
    dataSource: 'local' | 'blocknative'
}

// Should be structurally compatible with FungibleAsset or much code will
// likely explode.
export type NetworkBaseAsset = {
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
    chainID?: number
    blockExplorerUrl?: string,
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
    chainID: number
    family: 'EVM'
}

