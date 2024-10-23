import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Button, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const API_KEY = 'haofgJMRD7in7NfSsWrmKbVMrlXJDJhv1ZoEkEiQ';


  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0'); 
    return `${year}-${month}-${day}`;
  };

  const fetchData = async (selectedDate) => {
    setLoading(true);
    try {
      const formattedDate = formatDate(selectedDate);
      const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${formattedDate}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching the NASA data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(date);
  }, []);


  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate); 
    fetchData(currentDate); 
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>NASA Imagen Astronomica del Dia</Text>

      <View style={styles.datePickerContainer}>
        <Button title="Seleccionar Fecha" onPress={() => setShowPicker(true)} />
        <Text style={styles.selectedDate}>Fecha seleccionada: {formatDate(date)}</Text>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <Text style={styles.imageTitle}>{data.title}</Text>
          <Image source={{ uri: data.url }} style={styles.image} />

          <View style={styles.descriptionContainer}>
            <Text style={styles.explanation} numberOfLines={showFullDescription ? undefined : 5}>
              {data.explanation}
            </Text>
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.toggleText}>
                {showFullDescription ? 'Mostrar menos' : 'Mostrar más'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  datePickerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  selectedDate: {
    fontSize: 16,
    marginTop: 10,
  },
  loadingContainer: {
    marginTop: 50,
  },
  imageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  explanation: {
    fontSize: 16,
    textAlign: 'justify',
  },
  toggleText: {
    color: '#1E90FF',
    marginTop: 10,
    textAlign: 'right',
  },
});
