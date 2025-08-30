import { PERPLEXITY_API_KEY } from '@env';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export default function EasyScreen() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const [outputSelection, setOutputSelection] = useState<{ start: number; end: number } | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleFactCheck = async () => {
    Keyboard.dismiss();
    
    // Check if we have text selected in the output (for re-checking)
    const isOutputTextSelected = outputSelection && outputSelection.start !== outputSelection.end;
    // Check if we have text selected in the input
    const isInputTextSelected = selection && selection.start !== selection.end;
    
    let textToCheck = '';
    let sourceType = '';
    
    if (isOutputTextSelected && analysis) {
      // User has selected text in the output analysis
      textToCheck = analysis.substring(outputSelection.start, outputSelection.end);
      sourceType = 'output';
    } else if (isInputTextSelected) {
      // User has selected text in the input
      textToCheck = text.substring(selection.start, selection.end);
      sourceType = 'input';
    } else {
      // No selection, use full input text
      textToCheck = text;
      sourceType = 'input';
    }

    if (!textToCheck.trim()) {
      setError('Please enter or select text to fact-check.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setAnalysis('');
    setScore(null);

    const systemPrompt = `
      You are a fact-checking AI. Analyze the following text for factual accuracy.
      Respond in a JSON format with two keys:
      1. "score": An integer from 0 (completely false) to 100 (completely true).
      2. "analysis": A string containing your detailed analysis. In your analysis, use markdown for formatting. For example, use ** for bolding important corrections or confirmations.
    `;

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: textToCheck },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      try {
        const jsonMatch = content.match(/{[\s\S]*}/);

        if (jsonMatch) {
          const jsonString = jsonMatch[0];
          const parsedContent = JSON.parse(jsonString);
          if (typeof parsedContent.score === 'number' && typeof parsedContent.analysis === 'string') {
            setScore(parsedContent.score);
            setAnalysis(parsedContent.analysis);
          } else {
            throw new Error('Invalid JSON structure from AI.');
          }
        } else {
          throw new Error('No JSON object found in AI response.');
        }
      } catch (e) {
        setAnalysis(content);
        setScore(null);
        setError("Couldn't determine a truth score. Displaying raw analysis.");
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setAnalysis('');
      setScore(null);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={index} style={styles.boldText}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return part;
    });
  };

  const getRatingStyle = (currentScore: number | null) => {
    if (currentScore === null) return { color: '#A9A9A9', text: 'Not Rated' };
    if (currentScore >= 80) return { color: '#28a745', text: 'Highly Factual' };
    if (currentScore >= 60) return { color: '#ffc107', text: 'Likely Factual' };
    if (currentScore >= 40) return { color: '#fd7e14', text: 'Partially Factual' };
    if (currentScore >= 20) return { color: '#dc3545', text: 'Likely False' };
    return { color: '#a83232', text: 'Highly Inaccurate' };
  };

  const rating = getRatingStyle(score);
  const isInputTextSelected = selection && selection.start !== selection.end;
  const isOutputTextSelected = outputSelection && outputSelection.start !== outputSelection.end;
  
  // Determine button text based on what's selected
  const getButtonText = () => {
    if (isOutputTextSelected) return 'Check Output Selection';
    if (isInputTextSelected) return 'Check Input Selection';
    return 'Fact-Check';
  };

  const themeStyles = {
    container: {
      backgroundColor: isDarkMode ? '#121212' : '#F5F5F5',
    },
    input: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      borderColor: isDarkMode ? '#333' : '#E0E0E0',
    },
    resultContainer: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderColor: isDarkMode ? '#333' : '#E0E0E0',
    },
    resultText: {
      color: isDarkMode ? '#EAEAEA' : '#333333',
    },
    placeholder: {
      color: isDarkMode ? '#666' : '#999',
    },
    errorText: {
      color: isDarkMode ? '#ff7b7b' : '#D32F2F',
    },
    title: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    ratingBox: {
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0',
      borderColor: isDarkMode ? '#444' : '#ddd',
    },
    ratingLabel: {
      color: isDarkMode ? '#ccc' : '#555',
    },
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.title]}>Easy Mode</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, themeStyles.input]}
              placeholder="Enter text to fact-check..."
              placeholderTextColor={themeStyles.placeholder.color}
              multiline
              onChangeText={setText}
              value={text}
              onSelectionChange={({ nativeEvent: { selection } }) => setSelection(selection)}
            />
            <TouchableOpacity style={styles.button} onPress={handleFactCheck} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {getButtonText()}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {error && <Text style={[styles.errorText, themeStyles.errorText]}>{error}</Text>}

          <View style={[styles.resultContainer, themeStyles.resultContainer]}>
            {loading ? (
              <ActivityIndicator size="large" color={isDarkMode ? '#FFFFFF' : '#0000FF'} />
            ) : analysis || score !== null ? (
              <>
                <View style={[styles.ratingBox, themeStyles.ratingBox]}>
                  <View>
                    <Text style={[styles.ratingLabel, themeStyles.ratingLabel]}>Truthfulness</Text>
                    <Text style={[styles.ratingValue, { color: rating.color }]}>{rating.text}</Text>
                  </View>
                  {score !== null && (
                    <View style={styles.scoreCircle}>
                      <Text style={[styles.scoreText, { color: rating.color }]}>{score}</Text>
                      <Text style={[styles.scoreTotal, { color: rating.color }]}>/100</Text>
                    </View>
                  )}
                </View>
                <ScrollView style={styles.scrollView}>
                  <TextInput
                    style={[styles.resultText, themeStyles.resultText, styles.outputTextInput]}
                    value={analysis.replace(/\*\*(.*?)\*\*/g, '$1')} // Remove markdown formatting for text input
                    onChangeText={setAnalysis}
                    onSelectionChange={({ nativeEvent: { selection } }) => setOutputSelection(selection)}
                    multiline
                    placeholder="Analysis will appear here..."
                    placeholderTextColor={themeStyles.placeholder.color}
                    editable={true}
                  />
                </ScrollView>
              </>
            ) : (
              <Text style={[styles.placeholder, themeStyles.placeholder]}>
                The fact-checking analysis will appear here.
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'SpaceMono',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    minHeight: 100,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: 'top',
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
  },
  placeholder: {
    textAlign: 'center',
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  ratingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreTotal: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 2,
  },
  outputTextInput: {
    borderWidth: 0,
    padding: 0,
    minHeight: 100,
  },
});

