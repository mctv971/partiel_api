import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.API_KEY;

export async function getWeather(cityId) {
    const API_KEY = process.env.API_KEY;
    const url = `https://api-ugi2pflmha-ew.a.run.app/weather-predictions?cityId=${cityId}&apiKey=${API_KEY}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // Changer la clé "predictions" en "WeatherPredictions" si elle existe
      if (data.predictions !== undefined) {
        data.WeatherPredictions = data.predictions;
        delete data.predictions;
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  