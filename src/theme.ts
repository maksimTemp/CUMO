import type { Theme } from 'theme-ui';

export const theme: Theme = {
  colors: {
    text: '#212121',
    background: '#F5F5F5',
    primary: '#4CAF50',
    primaryDark: '#388E3C',
    secondaryText: '#757575',
    divider: '#E0E0E0',
    link: '#1E88E5',
    modes: {
      dark: {
        text: '#FFFFFF',
        background: '#212121',
        primary: '#388E3C',
        secondaryText: '#B0BEC5',
        divider: '#424242',
        link: '#29B6F6',
      },
    },
  },
  styles: {
    root: {
      backgroundColor: 'background',
      color: 'text',
      fontSize: '18px',
      lineHeight: '22px',
      margin: '0',
      li: {
        mb: '4px',
      },
    },
  },
};
