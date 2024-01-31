import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [forecastData, setForecastData] = useState([]);

  const getMeteo = async () => {
    try {
      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=45.78190100248175&lon=4.748340591070032&appid=95435d65d392e73961b46d9001d1df26&units=metric');
      const json = await response.json();
      setData(json);
      console.log(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getForecast = async () => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=45.78190100248175&lon=4.748340591070032&appid=95435d65d392e73961b46d9001d1df26&units=metric`);
        const json = await response.json();
        setForecastData(json.list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getForecast();
  }, []);

  useEffect(() => {
    getMeteo();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location is required!');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.forecastItem}>
      <Text>{new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      {item.weather && item.weather[0] && (
        <Image style={styles.icon} source={{ uri: `http://openweathermap.org/img/w/${item.weather[0].icon}.png` }} />
      )}
      <Text>{Math.round(item.main.temp)} °C</Text>
    </View>
  );

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{data.name}</Text>
      {data.weather && data.weather[0] && (
        <Image style={styles.image} source={{ uri: `http://openweathermap.org/img/w/${data.weather[0].icon}.png` }} />
      )}
      <Text style={styles.paragraph}>{Math.round(data.main && data.main.temp)} °C</Text>
      <Text style={styles.header}>Prévision des 5 prochains jours</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={forecastData}
          renderItem={renderItem}
          keyExtractor={(item) => item.dt.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9AF8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    border: 'solid 1px',
    borderRadius: '5px',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 100,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forecastItem: {
    margin: 10,
    alignItems: 'center',
  },
  icon: {
    width: 55,
    height: 55,
    
  },
  FlatList: {
    border: 'solid 2px',
  }, 
});
