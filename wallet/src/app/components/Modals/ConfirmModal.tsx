import React from 'react';
import { Stack } from 'react-bootstrap';

import {
    Button,
    Modal,
    Form,
} from '..';

type ModalProps = {
    title: string;
    message: string;
    onConfirm: () => void;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConfirmModal = ({ title, message, onConfirm, show, setShow }: ModalProps) => (
    <Modal show={show} fullscreen onHide={() => setShow(false)}>
        <Modal.Header className="text-center">
            <Modal.Title>
                {title}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
                <Form.Label>
                    {message}
                </Form.Label>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer className="text-center">
            <Stack
                direction="horizontal"
                className="text-center"
                gap={3}>
                <Button
                    type="button"
                    size="lg"
                    onClick={() => setShow(false)}
                    variant="warning">
                    Cancel
                </Button>
                <Button
                    size="lg"
                    type="button"
                    onClick={onConfirm}>
                    Confirm
                </Button>
            </Stack>
        </Modal.Footer>
    </Modal>
);

export default ConfirmModal;
