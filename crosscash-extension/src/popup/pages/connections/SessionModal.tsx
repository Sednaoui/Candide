import React from 'react';
import { Stack } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import {
    Button, Modal, Image, Row,
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
    setSessionInfo: React.Dispatch<React.SetStateAction<SessionInfo | undefined>>
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const SessionModal = ({ sessionInfo, setSessionInfo, show, setShow }: ModalProps) => {
    const dispatch = useDispatch();

    const confirm = () => {
        const address = sessionInfo?.address;
        const chainId = sessionInfo?.chainId;

        const payload = {
            address,
            chainId,
        };

        dispatch(confirmRequestSession(payload));
        setSessionInfo(undefined);
        setShow(false);
    };

    const reject = () => {
        dispatch(rejectRequestSession());
        setSessionInfo(undefined);
        setShow(false);
    };

    console.log('brazil');
    return (
        <>
            <Modal show={show} fullscreen onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>
                        approve incoming connection
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack gap={3}>
                        <Row>
                            {sessionInfo?.icons
                            && <Image src={sessionInfo.icons[0]} height="150" />}
                        </Row>
                        <Row>
                            name:
                            {' '}
                            {sessionInfo?.name}
                        </Row>
                        <Row>
                            from:
                            {' '}
                            {sessionInfo?.url}
                        </Row>
                        <Row>
                            address:
                            {' '}
                            {sessionInfo?.address}
                        </Row>
                        <Row>
                            on chain:
                            {' '}
                            {sessionInfo?.chainId}
                        </Row>

                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Stack direction="horizontal">
                        <Button type="button" onClick={reject} variant="warning">
                            reject
                        </Button>
                        <Button type="button" onClick={confirm}>
                            accept
                        </Button>
                    </Stack>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export type { SessionInfo };
export default SessionModal;
