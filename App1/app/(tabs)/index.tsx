import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const handleCheckText = async () => {
    if (!text.trim()) {
      setAnalysis('Please enter some text to check.');
      return;
    }
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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', // <-- IMPORTANT: Replace with your Perplexity API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'sonar-small-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a fact-checking assistant. Analyze the following text for misinformation. Respond with your analysis.'
            },
            {
              role: 'user',
              content: text
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setAnalysis(data.choices[0].message.content);
      } else {
        setAnalysis('Could not get a response from the AI. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setAnalysis(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
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
    resultText: {
      marginTop: 8,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[colorScheme ?? 'light'].tint,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      fontSize: 16,
      color: Colors[colorScheme ?? 'light'].text,
    },
    loadingIndicator: {
      marginTop: 20,
    }
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
  
        <TouchableOpacity style={styles.button} onPress={handleCheckText} disabled={loading}>
          <ThemedText style={styles.buttonText}>{loading ? 'Checking...' : 'Check Text'}</ThemedText>
        </TouchableOpacity>
  
        {loading && <ActivityIndicator size="large" style={styles.loadingIndicator} color={Colors[colorScheme ?? 'light'].tint} />}

        {analysis && (
          <View style={styles.resultsContainer}>
            <ThemedText type="subtitle">Analysis Result:</ThemedText>
            <ThemedText style={styles.resultText}>
              {analysis}
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}
