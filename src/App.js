import React, { Component } from 'react';
import './App.css';
import Routing from '../src/app/configs/Router'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#402501',
    },
    secondary: {
      main: '#da8000',
    },
    white: {
      main: '#fff'
    }
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme} >
        <div className="App" >
          <Routing />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
