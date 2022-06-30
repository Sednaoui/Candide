import {
    useEffect,
    useState,
} from 'react';

import {
    ARBITRUM,
    OPTIMISM,
} from '../../../../lib/constants/networks';
import { fetchAccountNFTAssets } from '../../../../lib/quixotic';
import { NFTData } from '../../../../lib/quixotic/types';
import {
    Card,
    ListGroup,
} from '../../../components';
import { useAppSelector } from '../../../store';

const NFTList = (): React.ReactElement => {
    const walletChainId = useAppSelector((state) => state.wallet.walletChainId);
    const address = useAppSelector((state) => state.wallet.walletInstance?.address);

    const [nftList, setNftList] = useState<NFTData[]>([]);

    async function findUsersnfts(walletAddress: string, chainId: number) {
        let apiKey = null;

        if (chainId === OPTIMISM.chainID) {
            apiKey = process.env.REACT_APP_QUIXOTIC_OPTIMISM;
        } else if (chainId === ARBITRUM.chainID) {
            apiKey = process.env.REACT_APP_QUIXOTIC_ARBITRUM;
        }

        if (apiKey) {
            const collectibleUpdate = await fetchAccountNFTAssets(
                chainId,
                walletAddress,
                apiKey,
            );

            if (collectibleUpdate) {
                const nftData = collectibleUpdate.results;

                if (nftData) {
                    setNftList(nftData);
                }
            } else {
                setNftList([]);
            }
        } else {
            setNftList([]);
        }
    }

    useEffect(() => {
        if (walletChainId && address) {
            findUsersnfts(address, walletChainId);
        }
    }, [walletChainId, address]);

    return (
        <ListGroup
            horizontal
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
            {nftList.map((i) => (
                <Card
                    key={i.token_id}
                    style={{
                        width: '12rem',
                        marginBottom: '12px',
                    }}
                    className="FlexIndividualCollection">
                    <Card.Img
                        variant="top"
                        src={i.image_url} />
                    <Card.Body>
                        <Card.Title>
                            {i.name}
                            {i.token_id}
                        </Card.Title>
                    </Card.Body>
                </Card>
            ))}
        </ListGroup>
    );
};

export default NFTList;
