import { run as runHolder } from 'holderjs';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../../assets/logo.png';
import {
    Carousel,
    Image,
    Stack,
    Container,
    Button,
} from '../../components';
import '../../App.css';

function Welcome(): JSX.Element {
    const navigate = useNavigate();

    useEffect(() => {
        // @ts-expect-error type error with library
        runHolder('image-class-name');
    });

    return (
        <Container className="container">
            <Carousel
                variant="dark"
                style={{
                    height: '480px',
                    width: '120%',
                }}>
                <Carousel.Item>
                    <Image
                        src="holder.js/300x400?text= &bg=#F8ECE1&fg=#1F2546"
                        alt="logo" />
                    <Carousel.Caption style={{ color: '#1F2546' }}>
                        <Image
                            src={logo}
                            style={{ height: 250 }}
                            alt="logo" />
                        <h3>
                            Welcome to Candide
                        </h3>
                        <p>
                            A self-custodial wallet for Ethereum and Layer2
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        src="holder.js/300x400?text= &bg=#F8ECE1&fg=#1F2546"
                        className="image-class-name"
                        alt="logo" />
                    <Carousel.Caption style={{ color: '#1F2546' }}>
                        <span role="img" aria-label="dog" style={{ fontSize: 100 }}>
                            ⛓️
                        </span>
                        <h3>
                            Cross-Transactional
                        </h3>
                        <p>
                            Transact on your favourite Layer2 no matter where
                            you are funds are parked
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        src="holder.js/300x400?text= &bg=#F8ECE1&fg=#1F2546"
                        className="image-class-name"
                        alt="logo" />
                    <Carousel.Caption style={{ color: '#1F2546' }}>
                        <Stack gap={2}>
                            <span role="img" aria-label="dog" style={{ fontSize: 100 }}>
                                🤓
                            </span>
                            <h3>
                                How it works
                            </h3>
                            <p>
                                Select the network where your funds are at,
                                and connect to your fav dapp on your network of choice
                            </p>
                        </Stack>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        src="holder.js/300x400?text= &bg=#F8ECE1&fg=#1F2546"
                        className="image-class-name"
                        alt="logo" />
                    <Carousel.Caption style={{ color: '#1F2546' }}>
                        <Stack gap={2}>
                            <span role="img" aria-label="dog" style={{ fontSize: 100 }}>
                                🐰
                            </span>
                            <h3>
                                then bridge!
                            </h3>
                            <p>
                                Candide will propose you to sign a pre-transaction to
                                bridge your funds to the Layer2 network of your choice
                            </p>
                            <Button
                                type="button"
                                className="btn-primary"
                                onClick={() => navigate('/import_wallet')}>
                                Get Started
                            </Button>
                        </Stack>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </Container>
    );
}

export default Welcome;
