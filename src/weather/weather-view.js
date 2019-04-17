import React,  { Component } from 'react';
import PropTypes from 'prop-types';
import {Grid, Paper, CircularProgress} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {grey} from '@material-ui/core/colors';
import Graph from './forecast-graph';
import Moment from 'react-moment';
import 'moment-timezone';

const styles = theme  => ({
      progress: {
        margin: theme.spacing.unit * 2,
      },
      paper: {
        padding: theme.spacing.unit * 2,
        margin: 'auto',
        maxWidth: 600, 
        color: grey[50]
      },
      textSeconday: {
        color: grey[200]
      },
      img:{
        width : '100px',
        height : '100px',
        margin : '-25px'
      }
      
  });
    
class Weather extends Component{
  constructor(props) {
    super(props);
  } 
  render() {
    const {forecast, classes} = this.props; 

    if(forecast.loading){
      return <Loader classes={classes}/>;
    }else if(!forecast.data.length ){
      return <h1>No Forecast details found</h1>;
    }
    
    return (
      <div className={classes.root}>
        <Paper className={classes.paper} style={{background: forecast.city.color}}>
          <Grid container>
            <ForecastCountry forecast={forecast} classes={classes}/>
            <Grid container direction="row" xs={12}>
              <CurrentWeather forecast={forecast.data[0]}  style={classes.img}/>
              <CurrentWeatherStats forecast={forecast.data[0]}/>    
            </Grid>     
          </Grid>
        <Grid container direction="row" xs={12} style={{marginTop:30}}>
          <FutureWeather forecast={forecast}/>
       </Grid>
      </Paper>
    </div>
    );
  }
} 

function Temparature(props){
  const {temp,label} = props;
  return <span>{label} {Math.round(temp)}<sup>.</sup>C</span>;
}

function TemparatureIcon(props){
  const {iconId} = props;
  return <img  src={`http://openweathermap.org/img/w/${iconId}.png`} />
}

function Loader(props){
  const {classes,color} = props;
  return (
    <Paper className={classes.paper}>
      <Grid container justify="center">
        <CircularProgress className={classes.progress} color="secondary"/>
      </Grid>
    </Paper>
  );
}

function ForecastCountry(props){
  const {forecast, classes} = props;
  return (
    <Grid item xs={12} style={{textAlign:'left'}}>
      <Typography variant="display2">{forecast.city.name}, {forecast.city.country}</Typography>
      <h4 className={classes.textSeconday} style={{fontWeight:'normal'}}>
         <Moment tz={forecast.city.timeZone} format="dddd, LT">{new Date()}</Moment>
      </h4>
    </Grid>
  );
}

function CurrentWeather(props){
  const {forecast, style} = props;
  const weather = forecast.weather[0];
  return ( 
     <Grid item container justify="center" xs={8}>
      <Grid item xs={8}>
          <Grid item>
          <TemparatureIcon iconId={weather.icon}/>
          <br />
          {weather.description}
        </Grid>
      </Grid>
      <Grid item>
        <h1 style={{marginTop: -2}}>
          <Temparature temp={(forecast.main || {}).temp}/> 
        </h1>
      </Grid>
     </Grid>
  );
}

function CurrentWeatherStats(props){
  const {forecast} = props;
  return (
    <Grid item xs={4}>
        <div><Temparature temp={forecast.min} label="Min"/></div>
        <div><Temparature temp={forecast.max} label="Max"/></div>
   </Grid>
  )
}

function FutureWeather(props){
  const {forecast} = props;
  return forecast.data.slice(1).map(data => (
    data.main && (
      <Grid container item xs={3} >
        <Grid container item > 
          <Moment format="dddd">{new Date(data.dt_txt)}</Moment>
        </Grid>
        <Grid item>
          <TemparatureIcon iconId={data.weather[0].icon}/>
         </Grid>
        <Grid container item style={{marginTop: -10}}>
          <Temparature temp={data.min}/>  &nbsp;&nbsp; 
          <Temparature temp={data.max}/> 
        </Grid>
      </Grid>
    )
        ))
}

export default withStyles(styles)(Weather);
