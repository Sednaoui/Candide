import React from 'react';

import {
    Button, Modal,
} from '../../components';

// eslint-disable-next-line react/prop-types
const ConfirmModal = ({ modalActive, setModalActive, txInfo }:
    { modalActive: any, setModalActive: any, txInfo: any}): React.ReactElement => {
    const handleClose = () => setModalActive(false);

    return (
        <>
            <Modal show={modalActive} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        incoming tx
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    gas: {txInfo[0].gas}
                    value: {txInfo[0].value}
                    from: {txInfo[0].from}
                    to: {txInfo[0].to}
                    data: {txInfo[0].data}
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" onClick={handleClose}>
                        reject
                    </Button>
                    <Button type="button" onClick={handleClose}>
                        accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfirmModal;
