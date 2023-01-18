// react
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  to: string;
  color?: string;
  children: any;
}

const Link = ({ to, color = 'black', children }: Props) => {
  const linkSX = {
    textDecoration: 'none'
  };

  return (
    <RouterLink
      to={to}
      style={{ color, ...linkSX }}
    >
      {children}
    </RouterLink>
  );
};

export default Link;
