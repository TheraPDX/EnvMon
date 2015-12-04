import React from 'react';
import ReactDOM from 'react-dom';
import spark from 'spark';

const TOKEN = '';
const HISTORY_SIZE = '10';

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
      <div className='temperature-container'>
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

  // XXX move in utils
  celsiusToFahrenheit(celsius) {
    return (celsius * 1.8) + 32;
  }

  // XXX move in utils
  toFixed(num, dp) {
    return Math.floor(num * Math.pow(10, dp)) / Math.pow(10, dp);
  }

  addTemperatureToHistory(celsius) {
    let temperature_history = this.state.temperature_history;
    temperature_history.unshift(celsius);
    if(temperature_history.length > HISTORY_SIZE) {
      temperature_history.pop();
    }

    this.setState({
      temperature_history
    });
  }

  setTemperature(value) {
    var celsius = value - 273.15;
    var fahrenheit = this.toFixed(this.celsiusToFahrenheit(celsius), 2);
    celsius = this.toFixed(celsius, 1);

    this.addTemperatureToHistory(celsius);

    this.setState({
      temperature: {
        celsius,
        fahrenheit,
      }
    });
  }

  setLight(value) {
    this.setState({
      light: value
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
        <Temperature temperature={this.state.temperature} />
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
