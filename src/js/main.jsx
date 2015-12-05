import React from 'react';
import ReactDOM from 'react-dom';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import spark from 'spark';

import utils from './utils';

const TOKEN = '';

class PageLoading extends React.Component {
  render() {
    return(
      <p>Loading...</p>
    );
  }
}

class Temperature extends React.Component {
  render() {
    return (
      <div style={{marginBottom: "20px"}}>
        <div className='main-temp'>
          {this.props.temperature.celsius} &deg;C
        </div>
        <div className='secondary-temp'>
          {this.props.temperature.fahrenheit} &deg;F
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      temperature: {
        celsius: 0,
        fahrenheit: 0,
      },
      temperature_history: [],
      light: 0,
    };
  }

  setTemperature(value) {
    var celsius = value - 273.15;
    var fahrenheit = utils.toFixed(utils.celsiusToFahrenheit(celsius), 2);
    celsius = utils.toFixed(celsius, 1);

    this.setState({
      temperature: {
        celsius,
        fahrenheit,
      },
      temperature_history: this.state.temperature_history.concat([celsius])
    });
  }

  setLight(light) {
    this.setState({
      light
    });
  }

  componentWillMount() {
    let ctx = this;

    spark.on('login', function() {
      spark.getEventStream('getTemp', 'mine', function(data) {
        ctx.setTemperature(data.data);
      });
      spark.getEventStream('getLight', 'mine', function(data) {
        ctx.setLight(data.data);
      });
    });
  }

  componentDidMount() {
    spark.login({ accessToken: TOKEN });
  }

  renderLoading() {
    return <PageLoading/>;
  }

  render() {
    if(this.state.loading) {
      return this.renderLoading();
    }

    let style = {
        backgroundColor: `rgba(4, 30, 55, ${this.state.light / 4096})`
    }
    return (
      <div className='app-container' style={style}>
        <div className='temperature-widget'>
          <Temperature temperature={this.state.temperature} />

          <Sparklines data={this.state.temperature_history} limit={20} width={450} height={100}>
            <SparklinesLine style={{stroke: "#82BB5D", strokeWidth: "2", fill: "none"}} />
          </Sparklines>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
