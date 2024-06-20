import attachDebugger from './attachDebugger'
import { setChromeProxy, getProxySettings } from 'utils/proxyUtils'

const attachTab = (tabId: number) => {
  chrome.debugger.getTargets((tabs) => {
    const currentTab = tabs.find((obj) => obj.tabId === tabId)
    if (!currentTab?.attached) {
      attachDebugger(tabId)
    }
  })
}
const settings = getProxySettings();

chrome.tabs.onCreated.addListener((tab) => {
  tab.id && attachDebugger(tab.id)
})

chrome.tabs.onActivated.addListener((tab) => {
  attachTab(tab.tabId)
})

chrome.tabs.onUpdated.addListener((tabId) => {
  attachTab(tabId)
})

// Apply proxy settings on extension load
chrome.runtime.onStartup.addListener(async () => {
  setChromeProxy(await settings);
});

// Listen for storage changes to update proxy settings
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === 'local') {
    setChromeProxy(await settings);
  }
});

// Apply proxy settings when the extension is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  setChromeProxy(await settings);
});

chrome.webRequest.onAuthRequired.addListener(
  (details, callback) => {
    chrome.storage.local.get(['username', 'password'], (result) => {
      if (callback) {
        callback({
          authCredentials: {
            username: result.username,
            password: result.password,
          },
        });
      }
    });
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);