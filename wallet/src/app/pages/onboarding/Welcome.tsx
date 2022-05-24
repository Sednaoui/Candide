import { Link } from 'react-router-dom';

import logo from '../../../assets/logo.jpeg';
import {
    Image,
    Stack,
    Container,
} from '../../components';
import '../../App.css';

function Welcome(): JSX.Element {
    return (
        <Container className="container">
            <Stack gap={2}>
                <Image
                    src={logo}
                    style={{ width: 350, maxHeight: 550 }}
                    alt="logo" />
                <h3>
                    Welcome to Candide
                </h3>
                <Link to="/import_wallet">
                    Get Started
                </Link>
            </Stack>
        </Container>
    );
}

export default Welcome;
