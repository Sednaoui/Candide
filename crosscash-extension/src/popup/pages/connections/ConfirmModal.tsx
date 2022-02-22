import React from 'react';

import {
    Button, Modal,
} from '../../components';

// eslint-disable-next-line react/prop-types
const ConfirmModal = ({ modalActive, setModalActive, txInfo, setTxApproved }:
    { modalActive: any, setModalActive: any, txInfo: any, setTxApproved: any}):
    React.ReactElement => {
    const handleCancel = () => {
        setModalActive(false);
        setTxApproved(false);
    };

    const handelApprove = () => {
        setTxApproved(true);
        setModalActive(false);
    };

    return (
        <>
            <Modal show={modalActive} onHide={handleCancel}>
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
                    <Button type="button" onClick={handleCancel}>
                        reject
                    </Button>
                    <Button type="button" onClick={handelApprove}>
                        accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfirmModal;
