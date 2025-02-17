import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
const WaterReminders = () => {
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [timeInputs, setTimeInputs] = useState([{ hour: '', minute: '' }]); // Shranjujemo več vnosov za čas

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        setNotificationPermission(true);
      } else {
        alert('Dovoljenja za obvestila niso bila dodeljena!');
      }
    };
    requestPermissions();
  }, []);

  // Funkcija za dodajanje novega vnosa za čas obvestila
  const addTimeInput = () => {
    setTimeInputs([...timeInputs, { hour: '', minute: '' }]);
  };

  // Funkcija za nastavitve obvestil ob več različnih časih vsak dan
  const setWaterReminders = async () => {
    try {
      // Preveri, ali so vsi vnosi pravilni
      for (const input of timeInputs) {
        const { hour, minute } = input;

        if (!hour || !minute) {
          alert('Prosim, vnesite vse ure in minute!');
          return;
        }

        const hourInt = parseInt(hour, 10);
        const minuteInt = parseInt(minute, 10);

        if (isNaN(hourInt) || isNaN(minuteInt) || hourInt < 0 || hourInt > 23 || minuteInt < 0 || minuteInt > 59) {
          alert('Prosim, vnesite veljavne ure in minute!');
          return;
        }

        // Preveri in pokaži nastavitve obvestila
        console.log(`Nastavljam obvestilo za uro: ${hourInt} in minuto: ${minuteInt}`);

        // Nastavi dnevni sprožilec za obvestilo ob tem času
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Čas za vodo!",
            body: "Spomni se, da piješ vodo. Tvoje telo te potrebuje!",
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            hour: hourInt,
            minute: minuteInt,
            repeats: true, // To pomeni, da bo obvestilo poslano vsak dan ob tej uri in minuti
            type: 'daily', // Dnevni sprožilec
          } as Notifications.DailyTriggerInput, // Uporabi `DailyTriggerInput`
        });
      }

      console.log("Vsa obvestila so bila načrtovana");
      Alert.alert("Obvestila nastavljena!", "Obvestila bodo poslana ob izbranih časih.");
    } catch (error) {
      console.log("Napaka pri nastavitvi obvestil: ", error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Remember me to drink water!</Text>

      {timeInputs.map((input, index) => (
        <View key={index} style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginRight: 10,
              paddingLeft: 10,
              width: 80,
            }}
            keyboardType="numeric"
            value={input.hour}
            onChangeText={(text) => {
              const newTimeInputs = [...timeInputs];
              newTimeInputs[index].hour = text;
              setTimeInputs(newTimeInputs);
            }}
            placeholder="Ura"
          />
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              paddingLeft: 10,
              width: 80,
            }}
            keyboardType="numeric"
            value={input.minute}
            onChangeText={(text) => {
              const newTimeInputs = [...timeInputs];
              newTimeInputs[index].minute = text;
              setTimeInputs(newTimeInputs);
            }}
            placeholder="Minuta"
          />
        </View>
      ))}

      <Button title="Dodaj čas" onPress={addTimeInput} />
      <Button title="Nastavi obvestila" onPress={setWaterReminders} />
    </View>
  );
};

export default WaterReminders;
