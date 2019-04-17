import cities from './cities';
const env = {
  weather: {
    key: '536a3c42dd9ccbfa83683f44378d74f9',
    domain: `https://api.openweathermap.org`
  },
  cities,
}
export default Object.freeze(Object.assign({}, env));;