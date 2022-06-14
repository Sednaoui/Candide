import { ethers } from 'ethers';
import {
    useEffect,
    useState,
} from 'react';

import optipunkABI from '../../../../contracts/optipunkABI.json';
import { optiPunkContractAddress } from '../../../../lib/constants/contracts';
import {
    Card,
    ListGroup,
} from '../../../components';
import { useAppSelector } from '../../../store';
import { useWalletProvider } from '../../../store/hooks';

const NFTList = (): React.ReactElement => {
    const provider = useWalletProvider();
    const address = useAppSelector((state) => state.wallet.walletInstance?.address);

    const [optiPunkList, setOptiPunkList] = useState([]);

    async function findUsersnfts(setaddress: string) {
        const collectibleUpdate = [];
        let tokenIndex = 0;
        let complete = false;

        try {
            while (complete === false) {
                if (provider) {
                    const contract = new ethers.Contract(
                        optiPunkContractAddress,
                        optipunkABI.abi,
                        provider,
                    );

                    const tokenId = await contract.tokenOfOwnerByIndex(
                        setaddress,
                        tokenIndex,
                    );

                    collectibleUpdate.push(tokenId.toNumber());

                    tokenIndex++;
                }
            }
        } catch (e) {
            complete = true;
        }

        setOptiPunkList(collectibleUpdate as any);
    }

    useEffect(() => {
        if (provider && address) {
            findUsersnfts(address);
        }
    }, [provider, address]);

    return (
        <>
            <ListGroup
                horizontal
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                {optiPunkList.map((id) => (
                    <Card
                        key={id}
                        style={{
                            width: '10rem',
                            marginBottom: '10px',
                        }}
                        className="FlexIndividualCollection">
                        <Card.Img
                            variant="top"
                            src={`https://optimarket-imgs.s3.us-east-2.amazonaws.com/QmbAhtqQqiSQqwCwQgrRB6urGc3umTskiuVpgX7FvHhutU/${id}.png`} />
                        <Card.Body>
                            <Card.Title>
                                OptiPunk #
                                {id}
                            </Card.Title>
                        </Card.Body>
                    </Card>
                ))}
            </ListGroup>
        </>
    );
};

export default NFTList;
