import CloseB from 'react-bootstrap/CloseButton';
import { useNavigate } from 'react-router-dom';

const CloseButton = (props: {
    onClick?: () => void;
    className?: string,
}): React.ReactElement => {
    const { className, onClick } = props;
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        if (onClick) {
            onClick();
        }
        navigate('/Wallet');
    };

    return (
        <CloseB
            type="button"
            onClick={handleClick}
            className={className} />
    );
};

export default CloseButton;
