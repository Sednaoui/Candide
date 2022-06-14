import { ReactNode } from 'react';

import {
    Container,
    Card,
} from '../index';

interface Props {
    children: ReactNode | ReactNode[]
}

const Layout = ({ children }: Props) => (
    <Container
        style={{
            backgroundColor: '#F8ECE1', // cream
            color: '#1F2546', // navy blue
        }}>
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0" />
        <Card
            border="light"
            style={{
                backgroundColor: '#F8ECE1', // cream
                width: '100%',
            }}>
            <Card.Body>
                {children}
            </Card.Body>
        </Card>
    </Container>
);

export default Layout;
