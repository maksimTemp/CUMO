import { Button as ThemeUIButton } from 'theme-ui';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: string;
  mt?: number;
}

const Button = ({ children, onClick, disabled = false, variant = 'primary', mt }: ButtonProps) => {
  return (
    <ThemeUIButton
      onClick={onClick}
      disabled={disabled}
      sx={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled ? 'divider' : variant,
        color: disabled ? 'secondaryText' : 'text',
        '&:hover': {
          backgroundColor: disabled ? 'divider' : `${variant}Dark`,
        },
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'background-color 0.3s',
        mt: mt,
      }}
    >
      {children}
    </ThemeUIButton>
  );
};

export default Button;
