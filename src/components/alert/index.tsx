// react
import { useState, useEffect } from 'react';

// mui
import { Alert as MuiAlert, Collapse, IconButton, AlertProps } from '@mui/material';
import { Close } from '@mui/icons-material';

interface Position {
  x: number;
  y: number;
}

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  absolute: boolean;
  position: Position;
  color: AlertProps['color'];
}

const defaultProps = {
  absolute: true,
  position: {
    x: '50%',
    y: 25
  },
  color: 'success'
};

type AlertPropsType = Props & typeof defaultProps;

const Alert = ({ children, onClose, absolute, position, color }: AlertPropsType) => {
  const [open, setOpen] = useState<boolean>(true);

  const defaultSx = {
    zIndex: 2000,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
    minWidth: 250
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleFinishCollapse = (): void => {
    onClose();
  };

  return (
    <Collapse
      sx={{
        ...defaultSx,
        ...(absolute
          ? {
              position: 'absolute',
              top: position.y,
              left: position.x,
              transform: 'translateX(-50%)'
            }
          : {})
      }}
      in={open}
      onExited={handleFinishCollapse}
    >
      <MuiAlert
        variant="standard"
        color={color}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <Close fontSize="inherit" />
          </IconButton>
        }
      >
        {children}
      </MuiAlert>
    </Collapse>
  );
};

Alert.defaultProps = defaultProps;

export default Alert;
