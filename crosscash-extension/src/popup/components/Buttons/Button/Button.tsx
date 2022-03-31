import React from 'react';
import ReactBoostrapButton from 'react-bootstrap/Button';

type Variant = 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | 'link'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-dark'
    | 'outline-light';

const Button = (props: {
    type: 'submit' | 'reset' | 'button',
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    disabled?: boolean | undefined,
    className?: string | undefined,
    variant?: Variant | undefined,
    size?: 'sm' | 'lg',
    children?: React.ReactNode,
}): React.ReactElement => {
    const { type, onClick, disabled, className, variant, size, children } = props;

    return (
        <ReactBoostrapButton
            type={type}
            variant={variant}
            className={className}
            onClick={onClick}
            size={size}
            disabled={disabled}>
            {children}
        </ReactBoostrapButton>
    );
};

export default Button;
