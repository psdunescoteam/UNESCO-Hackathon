import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<{ word: string; isMisinformation: boolean }[] | null>(null);
  const colorScheme = useColorScheme();

  const handleCheckText = () => {
    // In a real app, you would make an API call to a backend service
    // to check for misinformation.
    // For this example, we'll just simulate a check.
    const words = text.split(/\\s+/);
    const analysisResult = words.map(word => ({
      word,
      isMisinformation: Math.random() > 0.8 && word.length > 3, // Randomly flag words longer than 3 chars
    }));
    setAnalysis(analysisResult);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
    },
    title: {
      textAlign: 'center',
      marginBottom: 16,
    },
    input: {
      height: 200,
      borderColor: Colors[colorScheme ?? 'light'].tint,
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginTop: 16,
      textAlignVertical: 'top',
      color: Colors[colorScheme ?? 'light'].text,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      fontSize: 16,
    },
    button: {
      backgroundColor: Colors[colorScheme ?? 'light'].tint,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    resultsContainer: {
      marginTop: 20,
    },
    resultTextContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[colorScheme ?? 'light'].tint,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
    },
    normalText: {
      fontSize: 18,
      color: Colors[colorScheme ?? 'light'].text,
    },
    misinformation: {
      fontSize: 18,
      backgroundColor: 'yellow',
      color: 'red',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <ThemedView>
        <ThemedText type="title" style={styles.title}>FactCheckAI</ThemedText>
        <ThemedText>Enter text below to check for potential misinformation.</ThemedText>
        
        <TextInput
          style={styles.input}
          multiline
          placeholder="Start typing or paste your text here..."
          onChangeText={setText}
          value={text}
          placeholderTextColor={Colors[colorScheme ?? 'light'].text}
        />
  
        <TouchableOpacity style={styles.button} onPress={handleCheckText}>
          <ThemedText style={styles.buttonText}>Check Text</ThemedText>
        </TouchableOpacity>
  
        {analysis && (
          <View style={styles.resultsContainer}>
            <ThemedText type="subtitle">Analysis Result:</ThemedText>
            <View style={styles.resultTextContainer}>
              {analysis.map((item, index) => (
                <ThemedText
                  key={index}
                  style={item.isMisinformation ? styles.misinformation : styles.normalText}
                >
                  {item.word}{' '}
                </ThemedText>
              ))}
            </View>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}
