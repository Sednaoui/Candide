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
        className="container-fluid"
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
            paddingLeft: 0,
            paddingRight: 0,
        }}>
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0" />
        <Card
            style={{
                backgroundColor: '#1A2737',
                color: 'white',
                height: '100vh',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
                paddingBottom: 5,
            }}>
            <Card.Body
                style={{
                    paddingLeft: 2,
                    paddingRight: 2,
                }}>
                {children}
            </Card.Body>
        </Card>
    </Container>
);

export default Layout;
