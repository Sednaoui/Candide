import { QRCodeSVG } from 'qrcode.react';
import {
    useRef,
    useState,
} from 'react';

import { trancatAddress } from '../../../../lib/helpers';
import {
    Modal,
    Card,
    CloseButton,
    Button,
    Overlay,
    Tooltip,
} from '../../../components';
import { useAppSelector } from '../../../store';

type Props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReceiveModal = ({ show, setShow }: Props) => {
    const address = useAppSelector((state) => state.wallet.walletInstance?.address);

    const [showToolTip, setShowTooltip] = useState(false);

    const copy = async () => {
        if (address) {
            await navigator.clipboard.writeText(address);
            // show tooltip for 1 seconds
            setShowTooltip(true);
            setTimeout(() => {
                setShowTooltip(false);
            }, 1000);
        }
    };

    const target = useRef(null);

    return (
        <Modal show={show} fullscreen onHide={() => setShow(false)}>
            <Modal.Header>
                <Modal.Title>
                    Public Address
                </Modal.Title>
                <CloseButton onClick={() => setShow(false)} />
            </Modal.Header>
            <Modal.Body className="container">
                <Card>
                    <Card.Body>
                        <QRCodeSVG
                            value={address || ''}
                            size={290} />
                    </Card.Body>
                    <Card.Footer>
                        <Button
                            type="button"
                            buttonRef={target}
                            onClick={copy}>
                            {trancatAddress(address || '')}
                        </Button>
                        <Overlay target={target.current} show={showToolTip} placement="right">
                            {(props) => (
                                <Tooltip id="overlay" {...props}>
                                    Copied
                                </Tooltip>
                            )}
                        </Overlay>
                    </Card.Footer>
                </Card>
            </Modal.Body>
        </Modal>
    );
};

export default ReceiveModal;
