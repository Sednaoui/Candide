import { EthereumTransactionData as BlocknativeEthereumTransactionData }
    from 'bnc-sdk/dist/types/src/interfaces';

type TransferDetails = {
    counterparty: string
    amount: string
}
type AssetType = 'ether' | 'ERC20'

type AssetDetails = {
    type: AssetType
    symbol: string
}

type EthereumAssetBalanceChanges = {
    delta: string
    asset: AssetDetails
    breakdown: TransferDetails[]
}

// Some remedial typing for BlockNative; see blocknative/sdk#138 .
type EthereumNetBalanceChanges = {
    address: string
    balanceChanges: EthereumAssetBalanceChanges[]
}

export type EthereumTransactionData = BlocknativeEthereumTransactionData & {
    netBalanceChanges?: EthereumNetBalanceChanges[]
};
