import { useState } from 'react';
import ReactQrReader from 'react-qr-reader-es6';

import qrcodeicon from '../../../assets/qr-icon.svg';
import walletconnectbanner from '../../../assets/walletconnect-banner.svg';
import {
    Button,
    Spinner,
    Image,
} from '../index';

interface Props {
    onConnect: (uri: string) => Promise<void>
}

export default function QrReader({ onConnect }: Props) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const onError = () => {
        setShow(false);
    };

    const onScan = async (data: string | null) => {
        if (data) {
            await onConnect(data);
            setShow(false);
        }
    };

    const onShowScanner = () => {
        setLoading(true);
        setShow(true);
    };

    return (
        <div className="container">
            {show ? (
                <>
                    {loading
                        && (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </Spinner>
                        )}
                    <div className="qrVideoMask">
                        <ReactQrReader
                            onLoad={() => setLoading(false)}
                            showViewFinder={false}
                            onError={onError}
                            onScan={onScan}
                            style={{ width: '100%' }} />
                    </div>
                </>
            ) : (
                <>
                    <Image
                        src={walletconnectbanner}
                        width={200}
                        height={200} />
                    <div className="container qrPlaceholder">
                        <Image
                            src={qrcodeicon}
                            width={150}
                            height={150}
                            alt="qr code icon"
                            className="qrIcon" />
                        <Button
                            type="button"
                            onClick={onShowScanner}>
                            Scan QR code
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
