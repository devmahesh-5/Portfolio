import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city');

    let latitude: number, longitude: number;
    let cityName = 'Kathmandu';

    if (city === 'Kathmandu') {
      latitude = 27.7172;
      longitude = 85.3240;
    } else if (lat && lon) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lon);

      // Reverse geocode to get city name
      try {
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1`
        );
        const geoData = await geoResponse.json();
        if (geoData.results && geoData.results[0]) {
          cityName = geoData.results[0].name;
        }
      } catch (e) {
        // Keep default city name
      }
    } else {
      latitude = 27.7172;
      longitude = 85.3240;
    }

    // Using Open-Meteo API (free, no API key required)
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
    );

    if (!weatherResponse.ok) {
      throw new Error('Weather API failed');
    }

    const weatherData = await weatherResponse.json();
    const temp = Math.round(weatherData.current.temperature_2m);
    const code = weatherData.current.weather_code;

    // Map weather codes to conditions and icons
    const weatherMap: Record<number, { condition: string; icon: string }> = {
      0: { condition: 'Clear', icon: '☀️' },
      1: { condition: 'Mainly Clear', icon: '🌤️' },
      2: { condition: 'Partly Cloudy', icon: '⛅' },
      3: { condition: 'Overcast', icon: '☁️' },
      45: { condition: 'Foggy', icon: '🌫️' },
      48: { condition: 'Foggy', icon: '🌫️' },
      51: { condition: 'Drizzle', icon: '🌧️' },
      53: { condition: 'Drizzle', icon: '🌧️' },
      55: { condition: 'Drizzle', icon: '🌧️' },
      61: { condition: 'Rain', icon: '🌧️' },
      63: { condition: 'Rain', icon: '🌧️' },
      65: { condition: 'Heavy Rain', icon: '🌧️' },
      71: { condition: 'Snow', icon: '🌨️' },
      73: { condition: 'Snow', icon: '🌨️' },
      75: { condition: 'Snow', icon: '❄️' },
      80: { condition: 'Showers', icon: '🌦️' },
      81: { condition: 'Showers', icon: '🌦️' },
      82: { condition: 'Showers', icon: '🌦️' },
      95: { condition: 'Thunderstorm', icon: '⛈️' },
      96: { condition: 'Thunderstorm', icon: '⛈️' },
      99: { condition: 'Thunderstorm', icon: '⛈️' },
    };

    const weatherInfo = weatherMap[code] || { condition: 'Unknown', icon: '🌡️' };

    return NextResponse.json({
      temp,
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      location: cityName,
      cityName: cityName
    });

  } catch (error) {
    console.error('Weather error:', error);
    return NextResponse.json({
      temp: 22,
      condition: 'Clear',
      icon: '☀️',
      location: 'Kathmandu',
      cityName: 'Kathmandu'
    });
  }
}