import React from 'react';
import {
    WrappedComponentProps, withConfirmation, createConfirmation,
} from 'react-confirm-decorator';

import {
    Button, Modal,
} from '../../components';

type ModalProps = {
    txInfo: any, // this can be specified later (depending on signing or tx ofc..)
}

const ConfirmModal = ({
    show,
    confirm,
    abort,
    txInfo,
} : ModalProps & WrappedComponentProps): React.ReactElement => (
    <>
        <Modal show={show} onHide={abort}>
            <Modal.Header closeButton>
                <Modal.Title>
                    incoming tx
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                gas:
                {' '}
                {txInfo[0].gas}
                value:
                {' '}
                {txInfo[0].value}
                from:
                {' '}
                {txInfo[0].from}
                to:
                {' '}
                {txInfo[0].to}
                data:
                {' '}
                {txInfo[0].data}
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" onClick={abort}>
                    reject
                </Button>
                <Button type="button" onClick={confirm}>
                    accept
                </Button>
            </Modal.Footer>
        </Modal>
    </>
);

const WithConfirmation = withConfirmation(ConfirmModal);

export const confirmation = (props: ModalProps):
 Promise<boolean> => createConfirmation(WithConfirmation, props);

