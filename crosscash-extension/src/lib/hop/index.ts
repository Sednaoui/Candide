import {
    BaseProvider,
    TransactionResponse,
} from '@ethersproject/providers';
import {
    Hop,
    Token,
} from '@hop-protocol/sdk';
import {
    constants,
    Wallet,
    utils,
    UnsignedTransaction,
} from 'ethers';

import { HexString } from '../accounts';
import { FungibleAsset } from '../assets';
import { getEthereumNetwork } from '../helpers';

/**
 * checks for approval allowence to send tokens over hop contracts
 */
export const checkApprovalAllowance = async ({
    provider,
    chainId,
    privateKey,
    asset,
    amount,
}: {
    provider: BaseProvider,
    privateKey: string,
    chainId: number,
    asset: FungibleAsset,
    amount: string,
}): Promise<boolean | Error> => {
    const signer = new Wallet(privateKey, provider);
    const hop = new Hop('mainnet', signer);

    const network = getEthereumNetwork(chainId);

    // TODO: check if asset exsists on hop on both networks
    // TODO: No neet to approve ETH on mainnet, nor MATIC on polygon
    // will return error if tried to check for approval

    try {
        const bridge = hop.bridge(asset.symbol.toUpperCase());

        const networkName = network.name.toLowerCase();

        const approvalAddress = await bridge.getSendApprovalAddress(
            networkName,
            false,
        );
        const token = bridge.getCanonicalToken(networkName);

        const allowance = await token.allowance(approvalAddress);

        return allowance.gte(amount);
    } catch (error: any) {
        return new Error(error);
    }
};

/**
 * Approve allowance for sending tokens over hop contracts
 */
export const approveAllowance = async ({
    provider,
    privateKey,
    chainId,
    asset,
    amountToApprove,
}: {
    provider: BaseProvider,
    privateKey: string,
    chainId: number,
    asset: FungibleAsset,
    token: Token,
    amountToApprove?: string,
}): Promise<TransactionResponse | Error> => {
    try {
        const signer = new Wallet(privateKey, provider);
        const hop = new Hop('mainnet', signer);

        const network = getEthereumNetwork(chainId);

        // TODO: check if asset exsists on hop on both networks
        // TODO: No neet to approve ETH on mainnet, nor MATIC on polygon
        // will return error if tried to check for approval

        const bridge = hop.bridge(asset.symbol.toUpperCase());

        const networkName = network.name.toLowerCase();

        const approvalAddress = await bridge.getSendApprovalAddress(
            networkName,
            false,
        );
        const token = bridge.getCanonicalToken(networkName);

        return await token.approve(approvalAddress, amountToApprove || constants.MaxUint256);
    } catch (error: any) {
        return new Error(error);
    }
};

/**
 * Bridge tokens over hop contracts, assume approval is ok
 */
export const bridgeTokens = async ({
    provider,
    fromChainId,
    toChainId,
    privateKey,
    asset,
    amount,
    recipient,
}: {
    provider: BaseProvider,
    privateKey: string,
    fromChainId: number,
    toChainId: number,
    asset: FungibleAsset,
    amount: string,
    recipient: HexString,
}) => {
    try {
        const signer = new Wallet(privateKey, provider);
        const hop = new Hop('mainnet', signer);

        const fromNetwork = getEthereumNetwork(fromChainId).name.toLowerCase();
        const toNetwork = getEthereumNetwork(toChainId).name.toLowerCase();

        const bridge = hop.bridge(asset.symbol.toUpperCase());
        const amountBN = utils.parseUnits(amount, asset.decimals);

        return await bridge.send(
            amountBN,
            fromNetwork,
            toNetwork,
            { recipient },
        );
    } catch (error: any) {
        return new Error(error);
    }
};


/**
 * Populate a bridge transaction to send tokens over hop contracts
 */
export const populateBridgeTx = async ({
    sourceChainId,
    destinationChainId,
    recipient,
    asset,
    value,
}: {
    sourceChainId: number,
    destinationChainId: number,
    recipient: HexString,
    asset: FungibleAsset,
    value: string,
}): Promise<UnsignedTransaction | Error> => {
    const hop = new Hop('mainnet');

    const sourceNetwork = getEthereumNetwork(sourceChainId).name.toLowerCase();
    const destinationNetwork = getEthereumNetwork(destinationChainId).name.toLowerCase();

    try {
        const bridge = hop.bridge(asset.symbol.toUpperCase());

        const populateSendTx = await bridge.populateSendTx(
            value,
            sourceNetwork,
            destinationNetwork,
            { recipient },
        );

        const gasPrice = await bridge.getSendEstimatedGasCost(
            value,
            sourceNetwork,
            destinationNetwork,
            { recipient },
        );

        const gas = await bridge.estimateSendGasLimit(
            value,
            sourceNetwork, destinationNetwork,
            { recipient },
        );

        const tx = {
            ...populateSendTx,
            gasPrice,
            gas,
        };

        return tx;
    } catch (error: any) {
        return new Error(error);
    }
};
