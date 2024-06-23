import React, { ReactElement } from 'react'
import { Button } from 'theme-ui'

interface IconProps {
  Icon: React.ElementType;
  active?: boolean;
  onClick: () => void;
}

const TabItem = ({ Icon, onClick, active }: IconProps) => {
  return (
    <Button
      sx={{
        cursor: 'pointer',
        width: '36px',
        height: '36px',
        p: 0,
        m: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'background',
        backgroundColor: active ? 'primaryDark' : 'primary',
        ':hover': {
          backgroundColor: 'primaryDark',
        },
      }}
      onClick={onClick}
    >
      <Icon style={{ width: '24px', height: '24px' }} />
    </Button>
  )
}

export default TabItem
