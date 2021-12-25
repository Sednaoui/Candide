import React from 'react';
import ReactBoostrapButton from 'react-bootstrap/Button';

const Button = (props: {
    type: 'submit' | 'reset' | 'button',
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    disabled?: boolean | undefined,
    className?: string | undefined,
    children?: React.ReactNode,
}): React.ReactElement => {
    const { type, onClick, disabled, className, children } = props;

    return (
        <ReactBoostrapButton
            type={type}
            variant="primary"
            className={className}
            onClick={onClick}
            disabled={disabled}>
            {children}
        </ReactBoostrapButton>
    );
};

export default Button;
