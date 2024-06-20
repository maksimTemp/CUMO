import { useState } from 'react';
import { ThemeProvider, Flex, Box } from 'theme-ui';
import { theme } from '../theme';
import { Sun, Moon } from 'react-feather';
import { ReactComponent as Logo } from '../assets/icons/icon128.svg';
import { ReactComponent as SwitchUserAgent } from '../assets/icons/SwitchUserAgent.svg';
import { ReactComponent as Proxy } from '../assets/icons/proxy.svg';
import { ReactComponent as Location } from '../assets/icons/location.svg';
import { ReactComponent as Hide } from '../assets/icons/hide.svg';
import TabItem from './TabItem';
import LocationPage from './pages/locationPage';
import UserAgentPage from './pages/userAgentPage';
import ProxyPage from './pages/ProxyPage';
import HideExtensionsPage from './pages/HideExtensionsPage';
import 'assets/global.css';

const Popup = () => {
  const [tab, setTab] = useState('home');
  const [themeMode, setThemeMode] = useState('light');

  return (
    <ThemeProvider theme={{ ...theme, initialColorModeName: themeMode }}>
      <Flex sx={{ height: '100%', width: '100%' }}>
        <Box sx={{ m: '16px', width: '100%' }}>
          {tab === 'home' && <Logo style={{ width: '150px', height: 'auto' }} />}
          <LocationPage tab={tab} />
          <UserAgentPage tab={tab} />
          <ProxyPage tab={tab} />
          <HideExtensionsPage tab={tab} />
        </Box>
        <Flex
          sx={{
            minWidth: '36px',
            backgroundColor: 'primary',
            alignItems: 'center',
            flexDirection: 'column',
            right: 0,
          }}
        >
          <TabItem
            Icon={Logo}
            active={tab === 'home'}
            onClick={() => setTab('home')}
          />
          <TabItem
            Icon={Location}
            active={tab === 'location'}
            onClick={() => setTab('location')}
          />
          <TabItem
            Icon={SwitchUserAgent}
            active={tab === 'userAgent'}
            onClick={() => setTab('userAgent')}
          />
          <TabItem
            Icon={Proxy}
            active={tab === 'proxy'}
            onClick={() => setTab('proxy')}
          />
          <TabItem
             Icon={Hide}
            active={tab === 'hide'}
            onClick={() => setTab('hide')}
          />
          <TabItem
            Icon={themeMode === 'light' ? Sun : Moon}
            onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
          />
        </Flex>
      </Flex>
    </ThemeProvider>
  );
};

export default Popup;
