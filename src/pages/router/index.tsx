// react
import { Routes, Route } from 'react-router-dom';

// mui
import { styled } from '@mui/material/styles';

// types
import { RouteType } from 'types/utils';

// utils
import { utils } from 'utils/style-utils';
import { uuid } from 'utils/utils';

// route data
import routes from './PageRoutes';

const RouterWrapper = styled('div')(
  ({ theme }) =>
    ({
      height: '100%',
      width: '100%',
      background:
        theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.background.paper,
      transition: `${utils.colorAnimationTime} background`,
      overflow: 'scroll',
      ...utils.removeScrollbars
    } as any)
);

const Router = () => {
  return (
    <RouterWrapper>
      <Routes>
        {routes.map((route: RouteType) => (
          <Route
            path={route.path}
            element={route.element}
            key={uuid()}
          />
        ))}
      </Routes>
    </RouterWrapper>
  );
};

export default Router;
