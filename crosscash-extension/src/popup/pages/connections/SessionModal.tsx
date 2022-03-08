import React from 'react';
import { useDispatch } from 'react-redux';

import {
    Button, Modal,
} from '../../components';
import {
    confirmRequestSession,
    rejectRequestSession,
} from '../../store/wallet/actions';

type SessionInfo = {
    name: string;
    url: string;
    icons: string[] | null;
    chainId: number | null;
    address: string | undefined;
};

type ModalProps = {
    sessionInfo: SessionInfo | undefined; // typing is not always positive.
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const SessionModal = ({ sessionInfo, show, setShow }: ModalProps) => {
    const dispatch = useDispatch();

    const confirm = () => {
        const address = sessionInfo?.address;
        const chainId = sessionInfo?.chainId;

        const payload = {
            address,
            chainId,
        };

        dispatch(confirmRequestSession(payload));
        setShow(false);
    };

    const reject = () => {
        dispatch(rejectRequestSession());
        setShow(false);
    };

    console.log('brazil');
    return (
        <>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>
                        Approve incoming connection?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {sessionInfo?.name}
                    {sessionInfo?.url}
                    {sessionInfo?.chainId}
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" onClick={reject}>
                        reject
                    </Button>
                    <Button type="button" onClick={confirm}>
                        accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export { SessionInfo };
export default SessionModal;
