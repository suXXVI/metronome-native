import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image
} from "react-native";
import { Audio } from "expo-av";
import { Dial } from 'react-native-dial';
import playIcon from './assets/play.png'
import pauseIcon from './assets/pause.png'

export default function App() {
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();
  const [bpm, setBpm] = useState(60);
  const [prevDialValue, setPrevDialValue] = useState(0); // Track the previous dial value

  // getting click sound
  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/click.wav")
      );
      setSound(sound);
    };
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // play sound every count
  useEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
        if (sound) {
          sound.replayAsync();
        }
      }, 60000 / bpm);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isPlaying, sound, bpm]);

  // Update BPM based on the direction of rotation
  const handleDialChange = (value) => {
    const delta = value - prevDialValue;
    let newBpm = bpm;

    // Clockwise rotation: Increase BPM within the limit (max 200)
    if (delta > 0) {
      newBpm = Math.min(200, newBpm + 1);
    }
    // Counterclockwise rotation: Decrease BPM within the limit (min 60)
    else if (delta < 0) {
      newBpm = Math.max(60, newBpm - 1);
    }

    setBpm(newBpm);
    setPrevDialValue(value);
  };


  // start metronome
  const handlePress = () => {
    setIsPlaying(!isPlaying);
    setCount(0);
  };

  return (
    <View className="flex-1 bg-gray-300 w-full">
      <SafeAreaView>
        <View className="flex flex-row justify-center items-center h-56 w-full mt-24">
          <Text className="font-bold text-white text-9xl">{bpm}</Text>
        </View>

        <View className="w-full flex flex-row justify-center mx-auto mt-10">
          <Dial value={prevDialValue} onValueChange={handleDialChange} className="h-56 w-56 rounded-full" />
        </View>

        <View className="w-full flex flex-row justify-center mx-auto mt-20">
          <TouchableOpacity onPress={handlePress}>
            <View justifyContent="center items-center">
              <Image source={isPlaying ? pauseIcon : playIcon} className="h-10 w-10" />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
