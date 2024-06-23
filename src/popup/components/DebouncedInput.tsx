import { Dispatch, SetStateAction, ChangeEvent, useMemo } from 'react';
import { Label, Input, Box } from 'theme-ui';
import detachDebugger from 'utils/detachDebugger';
import debounce from 'lodash.debounce';

interface DebouncedInputProps {
  name: string;
  title: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onChange: (value: string) => void;
  mb?: string;
  type?: string;
}

const DebouncedInput = ({
  name,
  title,
  value,
  setValue,
  onChange,
  mb,
  type = 'text',
}: DebouncedInputProps) => {
  const debouncedChangeHandler = useMemo(
    () =>
      debounce((e: ChangeEvent<HTMLInputElement>) => {
        detachDebugger();
        chrome.storage.local.set({ [name]: e.target.value });
      }, 300),
    [name]
  );

  const changeInputText = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
    debouncedChangeHandler(e);
  };

  return (
    <Box>
      <Label htmlFor={name} sx={{ mb: '4px', lineHeight: '1.2'}}>{title}</Label>
      <Input
        name={name}
        value={value}
        onChange={changeInputText}
        mb={mb}
        type={type}
      />
    </Box>
  );
};

export default DebouncedInput;
