
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

const WeatherComponent = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const getWeather = async () => {
    try {
      const apiKey = '7e91fdec2034c35c57331421caa35a54';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

      const response = await axios.get(apiUrl);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo', error);
    }
  };

  return (
    <View>
      <Text>Saisissez le nom de la ville :</Text>
      <TextInput
        placeholder="Ville"
        value={city}
        onChangeText={(text) => setCity(text)}
      />
      <Button title="Obtenir la météo" onPress={getWeather} />
      
      {weatherData && (
        <View>
          <Text>Météo pour {weatherData.name}</Text>
          <Text>Température: {weatherData.main.temp}°C</Text>
          {/* Ajoutez d'autres informations météo selon vos besoins */}
        </View>
      )}
    </View>
  );
};

export default WeatherComponent;
