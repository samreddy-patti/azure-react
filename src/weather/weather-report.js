import React,  { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import Weather from './weather-view';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class WeatherReport extends Component{
  constructor(props) {
    super(props);
    this.state = { };
    this.loadForecast = this.loadForecast.bind(this);
  }

    componentDidMount(){
      this.setState({
       env: window.env
      })
    }

  getForecastByCityName(cityName){
    const {weather} = this.state.env;
    const url = `https://cors-anywhere.herokuapp.com/${weather.domain}/data/2.5/forecast?q=${cityName}&units=metric&appid=${weather.key}`;
    return  fetch(url, {method: 'get'}).then(res => res.json())
  }

  loadForecast(cityId){
    const city = this.props.cities[cityId];
    this.setState({
      city,
      forecast: {
        loading: true,
      } 
    })
    
   this.getForecastByCityName(cityId)
      .then((forecast) => {
          this.setState({
            forecast:{
              data: this.getTodayData(forecast),
              city: {
                ...city,
                ...forecast.city,
              }
              },
          });
      });
  }

  getTodayData(forecast){
   if(forecast.cod != 200){
     return [];
   }
    const today = new Date(forecast.list[0].dt_txt);

    const result =  forecast.list.reduce((result, val) => {
      const date = new Date(val.dt_txt); 
      const index = date.getDate() - today.getDate();
      
      const dateData = result[index] || {}; 
      if(date.getHours() === today.getHours()){
        dateData = {...dateData, ...val};
      }else {
        const history = dateData.history || [];
        history.push(val);
        dateData.history = history;
      }
      if(!dateData.min || val.main.temp_min < dateData.min){
          dateData.min = val.main.temp_min;
      }

      if(!dateData.max || val.main.temp_max > dateData.max){
          dateData.max = val.main.temp_max;
      }      
      result[index] = dateData;
      return result;
    }, []);
    
    return result;
  }

  
  

  render() {
    const {city, forecast} = this.state;
    const { classes, cities } = this.props;
    
    return (
      <div className={classes.root} style={{textAlign:'center'}}>
        <h1> Weather Report </h1>
        <Cities cities={cities} classes={classes} onCitySelect={this.loadForecast}/>
        {city ? <Weather forecast={forecast}/> : <h1 >Please select City</h1>} 
    </div>
    );
  }
}

function Cities(props){
  const { classes, cities, onCitySelect } = props;
  return Object.keys(cities)
          .map(city =>
            <Chip label={city} className={classes.chip}  variant="outlined"  color="primary"   onClick={() => onCitySelect(city)}/>
          );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 'auto',
    maxWidth: 500,
  },
  chip: {
    margin: theme.spacing.unit,
    padding: 20,
  },
});

export default withStyles(styles)(WeatherReport);