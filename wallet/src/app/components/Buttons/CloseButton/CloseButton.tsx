import CloseB from 'react-bootstrap/CloseButton';
import { useNavigate } from 'react-router-dom';

const CloseButton = (props: {
    onClick?: () => void;
    className?: string,
    variant?: 'white',
}): React.ReactElement => {
    const { className, onClick, variant } = props;
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        if (onClick) {
            onClick();
        }
        navigate('/wallet');
    };

    return (
        <CloseB
            type="button"
            variant={variant}
            onClick={handleClick}
            className={className} />
    );
};

export default CloseButton;
