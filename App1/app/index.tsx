import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Index() {
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
          'Authorization': 'Bearer YOUR_API_KEY', // Replace with your key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-small-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a fact-checking assistant. Analyze the following text for misinformation. Respond with a clear, concise analysis.',
            },
            {
              role: 'user',
              content: text,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
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
    safeArea: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#F4F7FC',
    },
    container: {
      flex: 1,
    },
    scrollView: {
      padding: 24,
    },
    header: {
      marginBottom: 32,
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: Colors[colorScheme ?? 'light'].text,
    },
    subtitle: {
      fontSize: 16,
      color: Colors[colorScheme ?? 'light'].text,
      marginTop: 8,
      opacity: 0.7,
    },
    card: {
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    input: {
      minHeight: 150,
      fontSize: 16,
      textAlignVertical: 'top',
      color: Colors[colorScheme ?? 'light'].text,
    },
    button: {
      backgroundColor: Colors.light.tint,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: Colors.light.tint,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    resultTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
      color: Colors[colorScheme ?? 'light'].text,
    },
    resultText: {
      fontSize: 16,
      lineHeight: 24,
      color: Colors[colorScheme ?? 'light'].text,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>FactCheckAI</ThemedText>
            <ThemedText style={styles.subtitle}>Your AI-powered misinformation detector.</ThemedText>
          </View>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Paste or type the text you want to check..."
              onChangeText={setText}
              value={text}
              placeholderTextColor={colorScheme === 'dark' ? '#888' : '#AAA'}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCheckText} disabled={loading}>
            <ThemedText style={styles.buttonText}>{loading ? 'Analyzing...' : 'Check Text'}</ThemedText>
          </TouchableOpacity>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.tint} />
            </View>
          )}

          {analysis && !loading && (
            <View style={[styles.card, { marginTop: 32 }]}>
              <ThemedText style={styles.resultTitle}>Analysis Result</ThemedText>
              <ThemedText style={styles.resultText}>{analysis}</ThemedText>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
