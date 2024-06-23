import attachDebugger from './attachDebugger'
import { setChromeProxy, getProxySettings } from 'utils/proxyUtils'
import { applyUserAgentSettings } from 'utils/userAgentUtils';

const attachTab = (tabId: number) => {
  chrome.debugger.getTargets((tabs) => {
    const currentTab = tabs.find((obj) => obj.tabId === tabId)
    if (!currentTab?.attached) {
      attachDebugger(tabId)
    }
  })
}

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id) {
    attachDebugger(tab.id)
  }
})

chrome.tabs.onActivated.addListener((tab) => {
  attachTab(tab.tabId)
})

chrome.tabs.onUpdated.addListener((tabId) => {
  attachTab(tabId)
})

chrome.runtime.onStartup.addListener(async () => {
  try {
    const settings = await getProxySettings();
    await setChromeProxy(settings);
  } catch (error) {
    console.error(`Failed to set proxy on startup: ${error}`);
  }
});

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === 'local') {
    try {
      const settings = await getProxySettings();
      await setChromeProxy(settings);
    } catch (error) {
      console.error(`Failed to set proxy on storage change: ${error}`);
    }
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const settings = await getProxySettings();
    await setChromeProxy(settings);
  } catch (error) {
    console.error(`Failed to set proxy on install: ${error}`);
  }
});
