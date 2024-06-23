import { useState, useEffect, ChangeEvent } from 'react';
import { Box, Label, Select, Flex } from 'theme-ui';
import Checkbox from 'popup/components/CheckBox';
import DebouncedInput from 'popup/components/DebouncedInput';
import userAgents from 'utils/userAgents';
import detachDebugger from 'utils/detachDebugger';
import Page from 'popup/components/Page';

interface UserAgentPageProps {
  tab: string;
}

const UserAgentPage = ({ tab }: UserAgentPageProps) => {
  const [browserDefault, setBrowserDefault] = useState(true);
  const [userAgentInfo, setUserAgentInfo] = useState<string>('');
  const [userAgent, setUserAgent] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');
  const [screenResolution, setScreenResolution] = useState<string>('');
  const [availableScreenSize, setAvailableScreenSize] = useState<string>('');
  const [deviceMemory, setDeviceMemory] = useState<number | string>('');
  const [hardwareConcurrency, setHardwareConcurrency] = useState<number | string>('');

  useEffect(() => {
    chrome.storage.local.get(
      [
        'userAgentBrowserDefault', 'userAgentInfo', 'userAgent', 'platform',
        'screenResolution', 'availableScreenSize', 'deviceMemory', 'hardwareConcurrency'
      ],
      (storage) => {
        if (storage.userAgentBrowserDefault !== undefined) setBrowserDefault(storage.userAgentBrowserDefault);
        if (storage.userAgentInfo) setUserAgentInfo(storage.userAgentInfo);
        if (storage.userAgent) setUserAgent(storage.userAgent);
        if (storage.platform) setPlatform(storage.platform);
        if (storage.screenResolution) setScreenResolution(storage.screenResolution);
        if (storage.availableScreenSize) setAvailableScreenSize(storage.availableScreenSize);
        if (storage.deviceMemory !== undefined) setDeviceMemory(storage.deviceMemory);
        if (storage.hardwareConcurrency !== undefined) setHardwareConcurrency(storage.hardwareConcurrency);
      }
    );
  }, []);

  const changeBrowserDefault = () => {
    detachDebugger();
    chrome.storage.local.set({ userAgentBrowserDefault: !browserDefault });
    setBrowserDefault(!browserDefault);
  };

  const changeUserAgentInfo = async (e: ChangeEvent<HTMLSelectElement>) => {
    detachDebugger();
    const value = e.target.value;
    setUserAgentInfo(value);
    chrome.storage.local.set({ userAgentInfo: value });

    if (value !== 'custom') {
      const userAgentObj = JSON.parse(value);
      setUserAgent(userAgentObj.value);
      setPlatform(userAgentObj.platform);
      setScreenResolution(userAgentObj.screenResolution);
      setAvailableScreenSize(userAgentObj.availableScreenSize);
      setDeviceMemory(userAgentObj.deviceMemory);
      setHardwareConcurrency(userAgentObj.hardwareConcurrency);
      chrome.storage.local.set({
        userAgent: userAgentObj.value,
        platform: userAgentObj.platform,
        screenResolution: userAgentObj.screenResolution,
        availableScreenSize: userAgentObj.availableScreenSize,
        deviceMemory: userAgentObj.deviceMemory,
        hardwareConcurrency: userAgentObj.hardwareConcurrency
      });
    }
  };

  const changeTextInput = () => {
    if (userAgentInfo !== 'custom') {
      setUserAgentInfo('custom');
      chrome.storage.local.set({ userAgentType: 'custom' });
    }
  };

  return (
    <Page isCurrentTab={tab === 'userAgent'} title={'User Agent'}>
      <Checkbox
        title="Use browser default"
        onChange={changeBrowserDefault}
        checked={browserDefault}
      />
      <Box
        sx={{
          opacity: browserDefault ? '0.5' : '1',
          pointerEvents: browserDefault ? 'none' : 'auto',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Label htmlFor="type">Type</Label>
          <Select
            name="type"
            id="type"
            value={userAgentInfo}
            onChange={changeUserAgentInfo}
            mb={'8px'}
          >
            <option value="custom">Custom</option>
            {Object.keys(userAgents).map((key) => (
              <optgroup key={key} label={userAgents[key].title}>
                {userAgents[key].values.map((ua: any) => (
                  <option key={ua.value} value={JSON.stringify(ua)}>
                    {ua.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Box>
        <DebouncedInput
          name="userAgent"
          title="User Agent"
          value={userAgent}
          setValue={setUserAgent}
          onChange={changeTextInput}
          mb="10px"
        />
        <DebouncedInput
          name="platform"
          title="Platform"
          value={platform}
          setValue={setPlatform}
          onChange={changeTextInput}
          mb="10px"
        />
        <Flex sx={{ gap: '12px', alignItems: 'flex-end' }}>
          <DebouncedInput
            name="screenResolution"
            title="Screen Resolution"
            value={screenResolution}
            setValue={setScreenResolution}
            onChange={changeTextInput}
            mb="10px"
          />
          <DebouncedInput
            name="availableScreenSize"
            title="Available Screen Size"
            value={availableScreenSize}
            setValue={setAvailableScreenSize}
            onChange={changeTextInput}
            mb="10px"
          />
        </Flex>
        <Flex sx={{ gap: '12px', alignItems: 'flex-end' }}>
          <DebouncedInput
            name="deviceMemory"
            title="Device Memory"
            value={deviceMemory !== undefined ? deviceMemory.toString() : ''}
            setValue={(value) => setDeviceMemory(value ? parseInt(value.toString(), 10) : '')}
            onChange={changeTextInput}
            mb="10px"
          />
          <DebouncedInput
            name="hardwareConcurrency"
            title="Hardware Concurrency"
            value={hardwareConcurrency !== undefined ? hardwareConcurrency.toString() : ''}
            setValue={(value) => setHardwareConcurrency(value ? parseInt(value.toString(), 10) : '')}
            onChange={changeTextInput}
            mb="10px"
          />
        </Flex>
      </Box>
    </Page>
  );
  
};

export default UserAgentPage;
