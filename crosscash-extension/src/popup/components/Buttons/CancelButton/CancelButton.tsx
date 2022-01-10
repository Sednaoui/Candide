import { useNavigate } from 'react-router-dom';

import Button from '../Button/Button';

const CancelButton = (props: {
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
        <Button
            type="button"
            onClick={handleClick}
            className={className}
            variant="link">
            Cancel
        </Button>
    );
};

export default CancelButton;
