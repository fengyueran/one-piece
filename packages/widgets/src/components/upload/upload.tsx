import { ChangeEvent, useRef } from 'react';

export interface UploadProps {
  directory?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onFiles: (files: FileList, directory?: boolean) => void;
}

export const Upload = (props: UploadProps) => {
  const {
    directory = false,
    multiple = false,
    disabled,
    onFiles,
    children,
  } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFiles(e.target.files as FileList, directory);
    e.target.value = '';
  };

  const handleClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <div onClick={handleClick} style={{ display: 'inline-block' }}>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        disabled={disabled}
        //@ts-ignore
        directory={directory ? '' : undefined}
        webkitdirectory={directory ? '' : undefined}
        style={{ display: 'none', pointerEvents: disabled ? 'none' : 'all' }}
        onChange={handleFileChange}
      />
      {children}
    </div>
  );
};
