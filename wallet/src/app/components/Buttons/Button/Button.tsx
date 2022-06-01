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
    buttonRef?: React.Ref<HTMLButtonElement>,
    children?: React.ReactNode,
}): React.ReactElement => {
    const { type, onClick, disabled, className, variant, size, buttonRef, children } = props;

    return (
        <>
            <style type="text/css">
                {`
                .btn-flat {
                background-color: #1F2546;
                color: white;
                }

                .btn-xxl {
                padding: 1rem 1.5rem;
                font-size: 1.5rem;
                }
                `}
            </style>
            <ReactBoostrapButton
                type={type}
                variant={variant || 'flat'}
                className={className}
                onClick={onClick}
                size={size}
                ref={buttonRef}
                disabled={disabled}>
                {children}
            </ReactBoostrapButton>
        </>
    );
};

export default Button;
