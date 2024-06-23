import { userAgents } from 'utils/userAgents';

// Define the user agent profile interface
interface UserAgentProfile {
    platform: string;
    title: string;
    userAgent: string;
    screenResolution?: string;
    availableScreenSize?: string;
    deviceMemory?: number;
    hardwareConcurrency?: number;
    acceptLanguage?: string;
    mobile?: boolean;
    deviceScaleFactor?: number;

  }
  
// Define the function to get default system values
export const getDefaultSystemValues = (): UserAgentProfile => {
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const availableScreenSize = `${window.screen.availWidth}x${window.screen.availHeight}`;

    return {
        platform: navigator.platform || 'Win32',
        title: 'Default System Profile',
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        availableScreenSize: availableScreenSize,
        deviceMemory: (navigator as any).deviceMemory || 4,  // Default to 4 if not available
        hardwareConcurrency: navigator.hardwareConcurrency || 4,  // Default to 4 if not available
        acceptLanguage: navigator.language || 'en-US',
        mobile: /Mobi|Android/i.test(navigator.userAgent),
        deviceScaleFactor: window.devicePixelRatio || 1
    };
};

  // Define the function to get the user agent settings
  export const getUserAgentSettings = (profileTitle: string): UserAgentProfile | null => {
    const profile = userAgents.find((profile: { title: string; }) => profile.title === profileTitle);
    return profile || null;
  };
  
  // Apply the user agent settings
  export const applyUserAgentSettings = async (tabId: number, profileTitle: string) => {
    const settings = getUserAgentSettings(profileTitle);
    if (settings) {
      chrome.debugger.attach({ tabId: tabId }, '1.3', () => {
        if (!chrome.runtime.lastError) {
          chrome.debugger.sendCommand(
            { tabId: tabId },
            'Emulation.setUserAgentOverride',
            {
              userAgent: settings.userAgent,
              platform: settings.platform || 'Win32'
            }
          );
  
          if (settings.screenResolution) {
            const [width, height] = settings.screenResolution.split('x').map(Number);
            chrome.debugger.sendCommand(
              { tabId: tabId },
              'Emulation.setDeviceMetricsOverride',
              {
                width: width,
                height: height,
                deviceScaleFactor: settings.deviceScaleFactor || 1,
                mobile: settings.mobile || false,
              }
            );
          }

          if (settings.availableScreenSize) {
            const [availWidth, availHeight] = settings.availableScreenSize.split('x').map(Number);
            chrome.debugger.sendCommand(
                { tabId: tabId },
                'Emulation.setVisibleSize',
                {
                    width: availWidth,
                    height: availHeight
                }
            );
        }
  
          // Inject script to override navigator properties
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: overrideNavigatorProperties,
            args: [
                settings.userAgent, 
                settings.platform, 
                settings.deviceMemory ?? 4, 
                settings.hardwareConcurrency ?? 4
            ]
          });
        }
      });
    }
  };
  
  // Define the function to override navigator properties
  function overrideNavigatorProperties(userAgent: string, platform: string, deviceMemory: number, hardwareConcurrency: number) {
    Object.defineProperty(navigator, 'userAgent', {
      value: userAgent,
      writable: false,
      configurable: false
    });
  
    Object.defineProperty(navigator, 'platform', {
      value: platform || 'Win32',  // Default to Win32 if platform is not provided
      writable: false,
      configurable: false
    });
  
    Object.defineProperty(navigator, 'deviceMemory', {
      value: deviceMemory || 4,  // Default to 4 if deviceMemory is not provided
      writable: false,
      configurable: false
    });
  
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: hardwareConcurrency || 4,  // Default to 4 if hardwareConcurrency is not provided
      writable: false,
      configurable: false
    });
  }
  