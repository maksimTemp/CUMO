// utils/proxyUtils.ts

interface ProxySettings {
  proxyEnabled: boolean;
  protocol: string;
  server: string;
  port: string;
  authEnabled: boolean;
  username: string;
  password: string;
}

const getProxySettings = (): Promise<ProxySettings> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      ['proxyEnabled', 'protocol', 'server', 'port', 'authEnabled', 'username', 'password'],
      (result) => {
        resolve(result as ProxySettings);
      }
    );
  });
};

const setChromeProxy = async (settings: ProxySettings) => {
  if (settings && settings.proxyEnabled) {
    const config: chrome.proxy.ProxyConfig = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          scheme: settings.protocol.toLowerCase(),
          host: settings.server,
          port: parseInt(settings.port),
        },
        bypassList: ['<local>'],
      },
    };

    chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error setting proxy: ${chrome.runtime.lastError.message}`);
      } else {
        console.log('Proxy set successfully');
      }
    });

    if (settings.authEnabled) {
      chrome.webRequest.onAuthRequired.addListener(
        (details, callback) => {
          if (callback) {
            callback({
              authCredentials: {
                username: settings.username,
                password: settings.password,
              },
            });
          }
        },
        { urls: ['<all_urls>'] },
        ['blocking']
      );
    }
  } else {
    chrome.proxy.settings.clear({ scope: 'regular' }, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error clearing proxy: ${chrome.runtime.lastError.message}`);
      } else {
        console.log('Proxy cleared successfully');
      }
    });
  }
};

export { getProxySettings, setChromeProxy };
