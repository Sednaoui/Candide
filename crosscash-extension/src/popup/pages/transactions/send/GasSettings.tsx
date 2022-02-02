import { utils } from 'ethers';
import {
    useEffect,
    useState,
} from 'react';

import {
    Modal,
    Form,
} from '../../../components';
import {
    useAppSelector,
    useAppDispatch,
} from '../../../store';
import {
    GasSpeed,
    setDefaultGasSpeed,
} from '../../../store/settings/actions';

type Props = {
    show: boolean;
    close: () => void;
    gasLimit: number;
}

const gasSpeed: GasSpeed[] = [
    {
        speed: 'fast',
        confidence: 99,
    },
    {
        speed: 'standard',
        confidence: 90,
    },
    {
        speed: 'slow',
        confidence: 80,
    },
];

const GasSettings = ({ show, close, gasLimit }: Props): React.ReactElement => {
    const dispatch = useAppDispatch();
    const defaultGasSpeed = useAppSelector((state) => state.settings.defaultGasSpeed);

    const estimatedBlockPrices = useAppSelector((state) =>
        state.transactions.blockPrices?.estimatedPrices);

    const [gasPriceOfTXInETH, setGasPriceOfTxInETH] = useState('0');

    useEffect(() => {
        if (estimatedBlockPrices) {
            const selectedGasFeeSpeedPrice = estimatedBlockPrices.find((e) =>
                e.confidence === defaultGasSpeed.confidence);

            if (selectedGasFeeSpeedPrice) {
                const gasInEth = Number(utils.formatUnits(Number(selectedGasFeeSpeedPrice.maxFeePerGas) * gasLimit, 'ether'));

                setGasPriceOfTxInETH(gasInEth.toFixed(8));
            }
        }
    }, [estimatedBlockPrices, gasLimit, setGasPriceOfTxInETH, defaultGasSpeed]);

    const gasSpeedElements = gasSpeed.map((gs) => (
        <Form.Check
            key={gs.speed}
            type="radio"
            id={`${gs.speed}-speed`}
            label={`${gs.speed} (${gs.confidence}% confidence)`}
            name="gasSpeed"
            value={gs.speed}
            onChange={() => dispatch(setDefaultGasSpeed(gs))}
            checked={gs.speed === defaultGasSpeed.speed} />
    ));

    return (
        <Modal
            show={show}
            onHide={() => close()}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {gasPriceOfTXInETH}
                    {' '}
                    ETH
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {gasSpeedElements}
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default GasSettings;
