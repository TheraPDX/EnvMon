import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import spark from 'spark';
import utils from './utils';

import ParticleLogin from '../../particle-login';

const SPARKLINE_LIMIT = 30;

const initialState = {
  temperature: {
    celsius: 0,
    fahrenheit: 0,
  },
  temperature_history: [],
  light: 0,
};

const reducer = (state = initialState, {type, celsius, fahrenheit, light}) => {
  switch (type) {
    case 'UPDATE_TEMPERATURE':
      return {
        temperature: {
          celsius: celsius,
          fahrenheit: fahrenheit,
        },
        temperature_history: [celsius, ...state.temperature_history],
        light: state.light,
      };
    case 'UPDATE_LIGHT':
      return {
        temperature: state.temperature,
        temperature_history: state.temperature_history,
        light: light,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

const Temperature = ({ value }) => (
  <div style={{marginBottom: "20px"}}>
    <div className='main-temp'>
      {value.temperature.celsius} &deg;C
    </div>
    <div className='secondary-temp'>
      {value.temperature.fahrenheit} &deg;F
    </div>
  </div>
);

const App = () => {
  const style = { backgroundColor: `rgba(4, 30, 55, ${store.getState().light / 4096})` };
  return (
    <div className='app-container' style={style}>
      <div className='temperature-widget'>
        <Temperature value={store.getState()} />
        <Sparklines data={store.getState().temperature_history} limit={SPARKLINE_LIMIT} width={450} height={100}>
          <SparklinesLine style={{stroke: "#82BB5D", strokeWidth: "2", fill: "none"}} />
        </Sparklines>
      </div>
    </div>
  );
}

const render = () => {
  ReactDOM.render(
    <App/>,
    document.getElementById('app')
  );
}

store.subscribe(render);
render();

spark.on('login', function() {
  spark.getEventStream('getLight', 'mine', function({data}) {
    store.dispatch({
      type: 'UPDATE_LIGHT',
      light: data,
    });
  });

  spark.getEventStream('getTemp', 'mine', function({data}) {
    if(isNaN(data)) {
      return;
    }

    let celsius = data - 273.15;
    let fahrenheit = utils.formatNumber(utils.celsiusToFahrenheit(celsius), 2);
    celsius = utils.formatNumber(celsius, 1);

    store.dispatch({
      type: 'UPDATE_TEMPERATURE',
      celsius,
      fahrenheit,
    });
  });
});
spark.login(ParticleLogin);
