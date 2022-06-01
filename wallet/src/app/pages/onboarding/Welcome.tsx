import { useNavigate } from 'react-router-dom';

import logo from '../../../assets/logo.png';
import {
    Image,
    Stack,
    Container,
    Button,
} from '../../components';
import '../../App.css';

function Welcome(): JSX.Element {
    const navigate = useNavigate();

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
                <Button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigate('/import_wallet')}>
                    Get Started
                </Button>
            </Stack>
        </Container>
    );
}

export default Welcome;
