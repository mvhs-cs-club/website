// react
import { useState, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  length: number;
  callback: () => void;
  sx: object;
}

const defaultProps = {
  sx: {},
  callback: () => {},
  length: 0.5
};

const FadeOut = ({ children, length, callback, sx }: Props) => {
  const [opacity, setOpacity] = useState<number>(1);

  const localWrapperSx = {
    ...sx,
    transition: `${length}s ease-in-out`,
    opacity
  };

  useEffect(() => {
    setOpacity(0);
    setTimeout(() => {
      callback();
    }, 1000 * length);
  }, [length, callback]);

  return <div style={localWrapperSx}>{children}</div>;
};

FadeOut.defaultProps = defaultProps;

export default FadeOut;
