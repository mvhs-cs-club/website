// react
import { useRef, useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
  length: number;
  sx: object;
  wrapperSx: object;
}

const defaultProps = {
  length: 0.5,
  sx: {},
  wrapperSx: {}
};

type ExpandDownProps = Props & typeof defaultProps;

const ExpandDown = ({ children, length, sx, wrapperSx }: ExpandDownProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<string>('0px');

  const handleSetHeight = (): void => {
    if (wrapperRef.current !== null) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setHeight(`${rect.height}px`);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleSetHeight();
    }, 1);
  }, [wrapperRef, children]);

  useEffect(() => {
    const refresh = (): void => {
      setTimeout(() => {
        handleSetHeight();
        refresh();
      }, 250);
    };
    refresh();
  }, []);

  const localWrapperSx = {
    transition: `${length}s`,
    overflow: 'hidden',
    height,
    ...wrapperSx
  };

  return (
    <div style={localWrapperSx}>
      <div
        style={sx}
        ref={wrapperRef}
      >
        {children}
      </div>
    </div>
  );
};

ExpandDown.defaultProps = defaultProps;

export default ExpandDown;
