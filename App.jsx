import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";

import { StyledComponent } from "nativewind";
import { Audio } from "expo-av";

export default function App() {
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();
  const [bpm, setBpm] = useState(60); // Start with 60 BPM

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

  // start metronome
  const handlePress = () => {
    setIsPlaying(!isPlaying);
    setCount(0);
  };

  // increase bpm
  const handleIncreaseBpm = () => {
    setBpm((prev) => prev + 1);
  };

  // decrease bpm
  const handleDecreaseBpm = () => {
    setBpm((prev) => prev - 1);
  };

  return (
    <View className="flex-1 bg-black w-full">
      <SafeAreaView>
        <View className="flex flex-row justify-center items-center h-56 w-full mt-56">
          <Text className="text-8xl font-bold text-white">{bpm}</Text>
        </View>

        <View className="w-full flex flex-row justify-center">
          <TouchableOpacity onPress={handlePress}>
            <Text className="text-4xl font-bold text-white">
              {isPlaying ? "Stop" : "Play"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-1/2 flex flex-row justify-between mx-auto mt-10">
          <TouchableOpacity onPress={handleDecreaseBpm}>
            <Text className="text-2xl font-bold text-white">-</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleIncreaseBpm}>
            <Text className="text-2xl font-bold text-white">+</Text>
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
