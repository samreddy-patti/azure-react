import React, { Component } from 'react';
import { render } from 'react-dom';
import WeatherReport from './weather';
import './style.css';
import env from './environment';

window.env = env;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }
  
  render() {
    return ( 
      <WeatherReport cities={env.cities}/> 
    );
  }
}


render(<App />, document.getElementById('root'));
