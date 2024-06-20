import { useState, useEffect, ChangeEvent, useCallback } from 'react'
import { Box, Flex, Label, Select } from 'theme-ui'
import Page from 'popup/components/Page'
import Checkbox from 'popup/components/CheckBox' 
import Button from 'popup/components/Button' 
import DebouncedInput from 'popup/components/DebouncedInput'

interface ProxyPageProps {
  tab: string;
}
const ProxyPage = ({ tab }: ProxyPageProps) => {
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [protocol, setProtocol] = useState('direct');
  const [server, setServer] = useState('');
  const [port, setPort] = useState('');
  const [authEnabled, setAuthEnabled] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    // Load the initial settings from storage
    chrome.storage.local.get(
      ['proxyEnabled', 'protocol', 'server', 'port', 'authEnabled', 'username', 'password', 'connectionStatus'],
      (result) => {
        setProxyEnabled(result.proxyEnabled || false);
        setProtocol(result.protocol || 'direct');
        setServer(result.server || '');
        setPort(result.port || '');
        setAuthEnabled(result.authEnabled || false);
        setUsername(result.username || '');
        setPassword(result.password || '');
        setConnectionStatus(result.connectionStatus || 'disconnected');
      }
    );
  }, []);
  

  const handleProxyToggle = () => {
    const newValue = !proxyEnabled;
    setProxyEnabled(newValue);
    chrome.storage.local.set({ proxyEnabled: newValue });
    if (!newValue) {
      setConnectionStatus('disconnected');
    }
  };

  const handleProtocolChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setProtocol(newValue);
    chrome.storage.local.set({ protocol: newValue });
  };

  const handleAuthToggle = () => {
    const newValue = !authEnabled;
    setAuthEnabled(newValue);
    chrome.storage.local.set({ authEnabled: newValue });
  };

  const handleInputChange = (name: string, value: string) => {
    chrome.storage.local.set({ [name]: value });
    if (name === 'server') {
      const parts = value.split(':');
      setServer(parts[0]);
      if (parts.length > 1) setPort(parts[1]);
      if (parts.length > 2) {
        setUsername(parts[2]);
        setAuthEnabled(true);
      }
      if (parts.length > 3) setPassword(parts[3]);
    } else {
      switch (name) {
        case 'port':
          setPort(value);
          break;
        case 'username':
          setUsername(value);
          break;
        case 'password':
          setPassword(value);
          break;
      }
    }
  };
  

  const handleDisconnect = () => {
    setProxyEnabled(false);
    setConnectionStatus('disconnected');
    // Logic to clear proxy settings
    chrome.proxy.settings.clear({ scope: 'regular' }, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error clearing proxy: ${chrome.runtime.lastError.message}`);
      } else {
        console.log('Proxy cleared successfully');
      }
    });
  };

  const handleConnect = async () => {
    if (proxyEnabled) {
      const config: chrome.proxy.ProxyConfig = {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: protocol.toLowerCase(),
            host: server,
            port: parseInt(port),
          },
          bypassList: ['<local>'],
        },
      };

      chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
        if (chrome.runtime.lastError) {
          console.error(`Error setting proxy: ${chrome.runtime.lastError.message}`);
          setConnectionStatus('failed');
          chrome.storage.local.set({ connectionStatus: 'failed' });
        } else {
          console.log('Proxy set successfully');
          setConnectionStatus('connected');
          chrome.storage.local.set({ connectionStatus: 'connected' });
        }
      });

      if (authEnabled) {
        chrome.webRequest.onAuthRequired.addListener(
          (details, callback) => {
            if (callback) {
              callback({
                authCredentials: {
                  username: username,
                  password: password,
                },
              });
            }
          },
          { urls: ['<all_urls>'] },
          ['blocking']
        );
      }
    } else {
      setConnectionStatus('failed');
      chrome.storage.local.set({ connectionStatus: 'failed' });
    }
  };

  
  const checkConnection = () => {
    return new Promise((resolve) => {
      fetch('https://www.google.com') // URL для проверки соединения
        .then((response) => {
          if (response.ok) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => resolve(false));
    });
  };
  

  const buttonAction = connectionStatus === 'connected' ? handleDisconnect : handleConnect;
  const buttonText = connectionStatus === 'connected' ? 'Disconnect' : 'Connect';

  return (
    <Page isCurrentTab={tab === 'proxy'} title={'Proxy Settings'}>
      <Checkbox
        title="Enable Proxy"
        onChange={handleProxyToggle}
        checked={proxyEnabled}
      />
      <Box
        sx={{
          opacity: proxyEnabled ? '1' : '0.5',
          pointerEvents: proxyEnabled ? 'auto' : 'none',
        }}
      >
        <Label htmlFor="protocol">Protocol</Label>
        <Select
          name="protocol"
          value={protocol}
          onChange={handleProtocolChange}
          mb={'8px'}
        >
          <option value="direct">Direct</option>
          <option value="HTTP">HTTP</option>
          <option value="HTTPS">HTTPS</option>
          <option value="SOCKS4">SOCKS4</option>
          <option value="SOCKS5">SOCKS5</option>
        </Select>
        <DebouncedInput
          name="server"
          title="Server"
          value={server}
          setValue={setServer}
          onChange={(value) => handleInputChange('server', value)}
        />
        <DebouncedInput
          name="port"
          title="Port"
          value={port}
          setValue={setPort}
          onChange={(value) => handleInputChange('port', value)}
          type="number"
        />
        <Checkbox
          title="Proxy Authentication"
          onChange={handleAuthToggle}
          checked={authEnabled}
        />
        <Box
          sx={{
            opacity: authEnabled ? '1' : '0.5',
            pointerEvents: authEnabled ? 'auto' : 'none',
          }}
        >
          <DebouncedInput
            name="username"
            title="Username"
            value={username}
            setValue={setUsername}
            onChange={(value) => handleInputChange('username', value)}
          />
          <DebouncedInput
            name="password"
            title="Password"
            value={password}
            setValue={setPassword}
            onChange={(value) => handleInputChange('password', value)}
            type="password"
          />
        </Box>
      </Box>
      <Box mt={3}>
        <Box as="span">Connection Status: </Box>
        <Box
          as="span"
          sx={{
            color: connectionStatus === 'connected' ? 'green' : 'red',
          }}
        >
          {connectionStatus}
        </Box>
      </Box>
      <Button mt={2} onClick={buttonAction}>
        {buttonText}
      </Button>
    </Page>
  );
};


export default ProxyPage;
