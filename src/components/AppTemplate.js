import React from 'react'

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import {
  CssBaseline,
  BottomNavigation,
  BottomNavigationAction,
  Box
} from "@material-ui/core";
import {
  Restore as RestoreIcon,
  Favorite as FavoriteIcon,
} from '@material-ui/icons'


import './styles/AppTemplate.css'

const theme = createMuiTheme({});

const AppTemplate = ({ children }) => {
  const [pageIndex, setPageIndex] = React.useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-template">
        <Box className="app-template__body">{children && children(pageIndex)}</Box>
        <footer>
          <BottomNavigation
            value={pageIndex}
            onChange={(_, newValue) => {
              setPageIndex(newValue);
            }}
            showLabels
            // className={classes.root}
          >
            <BottomNavigationAction label="HOME" icon={<RestoreIcon />} />
            <BottomNavigationAction label="HISTORY" icon={<FavoriteIcon />} />
          </BottomNavigation>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default AppTemplate;
