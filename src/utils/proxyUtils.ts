export interface ProxySettings {
  protocol: string;
  server: string;
  port: string;
  authEnabled: boolean;
  username?: string;
  password?: string;
}

export const getProxySettings = (): Promise<ProxySettings> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(
      ['protocol', 'server', 'port', 'authEnabled', 'username', 'password'],
      (settings) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve({
          protocol: settings.protocol || 'direct',
          server: settings.server || '',
          port: settings.port || '',
          authEnabled: settings.authEnabled || false,
          username: settings.username || '',
          password: settings.password || '',
        });
      }
    );
  });
};


export const setChromeProxy = async (settings: ProxySettings) => {
  if (settings.protocol === 'direct') {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [],
    });
    return;
  }

  const config: chrome.proxy.ProxyConfig = {
    mode: 'fixed_servers',
    rules: {
      singleProxy: {
        scheme: settings.protocol.toLowerCase(),
        host: settings.server,
        port: parseInt(settings.port, 10),
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

  if (settings.authEnabled && settings.username && settings.password) {
    const authHeader = btoa(`${settings.username}:${settings.password}`);
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        id: 1,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [
            {
              header: 'Proxy-Authorization',
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: `Basic ${authHeader}`
            }
          ]
        },
        condition: {
          urlFilter: '*',
          resourceTypes: [
            chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
            chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
          ]
        }
      }],
      removeRuleIds: [1]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error updating dynamic rules: ${chrome.runtime.lastError.message}`);
      } else {
        console.log('Dynamic rules updated successfully');
      }
    });
  } else {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [],
    }, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error clearing dynamic rules: ${chrome.runtime.lastError.message}`);
      } else {
        console.log('Dynamic rules cleared successfully');
      }
    });
  }
}

export const clearProxy = () => {
  chrome.proxy.settings.clear({ scope: 'regular' }, () => {
    if (chrome.runtime.lastError) {
      console.error(`Error clearing proxy: ${chrome.runtime.lastError.message}`);
    } else {
      console.log('Proxy cleared successfully');
    }
  });
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [],
  });
};
