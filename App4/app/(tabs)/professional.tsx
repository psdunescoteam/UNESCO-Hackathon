import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { useState } from 'react';
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
    TouchableWithoutFeedback,
    useColorScheme,
    View,
} from 'react-native';

export default function Professional() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState('sonar-pro');
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const [outputSelection, setOutputSelection] = useState<{ start: number; end: number } | null>(null);
  const colorScheme = useColorScheme();

  const PERPLEXITY_API_KEY = (Constants as any).expoConfig?.extra?.PERPLEXITY_API_KEY;

  const handleFactCheck = async () => {
    Keyboard.dismiss();
    
    // Check if we have text selected in the output (for re-checking)
    const isOutputTextSelected = outputSelection && outputSelection.start !== outputSelection.end;
    // Check if we have text selected in the input
    const isInputTextSelected = selection && selection.start !== selection.end;
    
    let textToCheck = '';
    
    if (isOutputTextSelected && result) {
      // User has selected text in the output analysis
      textToCheck = result.substring(outputSelection.start, outputSelection.end);
    } else if (isInputTextSelected) {
      // User has selected text in the input
      textToCheck = text.substring(selection.start, selection.end);
    } else {
      // No selection, use full input text
      textToCheck = text;
    }

    if (!textToCheck.trim()) {
      setError('Please enter or select text to fact-check.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult('');
    setScore(null);

    if (model.startsWith('sonar')) {
      const url = 'https://api.perplexity.ai/chat/completions';
      const headers = {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      };

      const systemPrompt = `
        You are a fact-checking AI. Analyze the following text for factual accuracy.
        Respond in a JSON format with two keys:
        1. "score": An integer from 0 (completely false) to 100 (completely true).
        2. "analysis": A string containing your detailed analysis. In your analysis, use markdown for formatting. For example, use ** for bolding important corrections or confirmations.
      `;

      const payload = {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: textToCheck },
        ],
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
          const jsonMatch = content.match(/{[\s\S]*}/);

          if (jsonMatch) {
            const jsonString = jsonMatch[0];
            const parsedContent = JSON.parse(jsonString);
            if (typeof parsedContent.score === 'number' && typeof parsedContent.analysis === 'string') {
              setScore(parsedContent.score);
              setResult(parsedContent.analysis);
            } else {
              throw new Error('Invalid JSON structure from AI.');
            }
          } else {
            throw new Error('No JSON object found in AI response.');
          }
        } catch (e) {
          setResult(content);
          setScore(null);
          setError("Couldn't determine a truth score. Displaying raw analysis.");
        }
      } catch (error) {
        console.error('Error during fact-check:', error);
        setError('Sorry, an error occurred while trying to fact-check.');
        setResult('');
        setScore(null);
      } finally {
        setLoading(false);
      }
    } else {
      setResult(`The ${model} model is not yet implemented.`);
      setLoading(false);
    }
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
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#F8F9FA',
    },
    title: {
      color: colorScheme === 'dark' ? '#FFFFFF' : '#212529',
    },
    subtitle: {
      color: colorScheme === 'dark' ? '#A9A9A9' : '#6C757D',
    },
    sectionTitle: {
      color: colorScheme === 'dark' ? '#FFFFFF' : '#333333',
    },
    input: {
      borderColor: colorScheme === 'dark' ? '#444' : '#CED4DA',
      backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#FFFFFF',
      color: colorScheme === 'dark' ? '#FFFFFF' : '#212529',
    },
    inputWrapper: {
      backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#FFFFFF',
      borderColor: colorScheme === 'dark' ? '#444' : '#E0E0E0',
    },
    resultContainer: {
      backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      borderColor: colorScheme === 'dark' ? '#333' : '#E0E0E0',
    },
    analysisContainer: {
      backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#F8F9FA',
      borderColor: colorScheme === 'dark' ? '#444' : '#E0E0E0',
    },
    analysisText: {
      color: colorScheme === 'dark' ? '#EAEAEA' : '#343A40',
    },
    analysisTitle: {
      color: colorScheme === 'dark' ? '#FFFFFF' : '#333333',
    },
    pickerContainer: {
      borderColor: colorScheme === 'dark' ? '#444' : '#CED4DA',
      backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#FFFFFF',
    },
    modelSection: {
      backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      borderColor: colorScheme === 'dark' ? '#333' : '#E0E0E0',
    },
    picker: {
      color: colorScheme === 'dark' ? '#FFFFFF' : '#212529',
    },
    errorText: {
      color: colorScheme === 'dark' ? '#ff7b7b' : '#D32F2F',
    },
    errorContainer: {
      backgroundColor: colorScheme === 'dark' ? '#2C1F1F' : '#FFF5F5',
      borderColor: colorScheme === 'dark' ? '#5C2626' : '#FED7D7',
    },
    ratingCard: {
      backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#F8F9FA',
      borderColor: colorScheme === 'dark' ? '#444' : '#E0E0E0',
    },
    ratingLabel: {
      color: colorScheme === 'dark' ? '#ccc' : '#555',
    },
    charCountText: {
      color: colorScheme === 'dark' ? '#666' : '#999',
    },
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, themeStyles.container]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons 
                name="shield-checkmark" 
                size={40} 
                color={colorScheme === 'dark' ? '#007BFF' : '#007BFF'} 
                style={styles.headerIcon}
              />
              <Text style={[styles.title, themeStyles.title]}>FactCheck Pro</Text>
            </View>
            <Text style={[styles.subtitle, themeStyles.subtitle]}>Advanced AI-Powered Verification</Text>
          </View>

          <View style={[styles.modelSection, themeStyles.modelSection]}>
            <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>AI Model</Text>
            <View style={[styles.pickerContainer, themeStyles.pickerContainer]}>
              <Picker
                selectedValue={model}
                style={[styles.picker, themeStyles.picker]}
                itemStyle={styles.pickerItem}
                onValueChange={(itemValue) => setModel(itemValue)}
              >
                <Picker.Item label="🚀 Sonar Pro (Recommended)" value="sonar-pro" />
                <Picker.Item label="⚡ Sonar Free" value="sonar-free" />
                <Picker.Item label="🤖 Gemini" value="gemini" />
                <Picker.Item label="💬 ChatGPT" value="chatgpt" />
                <Picker.Item label="🎯 Claude" value="claude" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Text to Analyze</Text>
            <View style={[styles.inputWrapper, themeStyles.inputWrapper]}>
              <TextInput
                style={[styles.input, themeStyles.input]}
                placeholder="Enter the text you want to fact-check..."
                placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
                onChangeText={setText}
                value={text}
                onSelectionChange={({ nativeEvent: { selection } }) => setSelection(selection)}
                multiline
              />
              {text.length > 0 && (
                <View style={styles.charCount}>
                  <Text style={[styles.charCountText, themeStyles.charCountText]}>
                    {text.length} characters
                  </Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleFactCheck} 
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Ionicons name="search" size={20} color="white" />
              )}
              <Text style={styles.buttonText}>
                {loading ? 'Analyzing...' : getButtonText()}
              </Text>
            </View>
          </TouchableOpacity>

          {error && (
            <View style={[styles.errorContainer, themeStyles.errorContainer]}>
              <Ionicons name="warning" size={20} color={themeStyles.errorText.color} />
              <Text style={[styles.errorText, themeStyles.errorText]}>{error}</Text>
            </View>
          )}
          
          {(result || score !== null) && (
            <View style={[styles.resultContainer, themeStyles.resultContainer]}>
              <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Analysis Results</Text>
              
              {score !== null && (
                <View style={[styles.ratingCard, themeStyles.ratingCard]}>
                  <View style={styles.ratingHeader}>
                    <Ionicons 
                      name="analytics" 
                      size={24} 
                      color={rating.color} 
                      style={styles.ratingIcon}
                    />
                    <View style={styles.ratingInfo}>
                      <Text style={[styles.ratingLabel, themeStyles.ratingLabel]}>Truthfulness Score</Text>
                      <Text style={[styles.ratingValue, { color: rating.color }]}>{rating.text}</Text>
                    </View>
                  </View>
                  <View style={[styles.scoreDisplay, { backgroundColor: `${rating.color}20` }]}>
                    <Text style={[styles.scoreText, { color: rating.color }]}>{score}</Text>
                    <Text style={[styles.scoreTotal, { color: rating.color }]}>/100</Text>
                  </View>
                </View>
              )}
              
              <View style={[styles.analysisContainer, themeStyles.analysisContainer]}>
                <Text style={[styles.analysisTitle, themeStyles.analysisTitle]}>Detailed Analysis</Text>
                <ScrollView style={styles.analysisScrollView}>
                  <TextInput
                    style={[styles.analysisText, themeStyles.analysisText]}
                    value={result.replace(/\*\*(.*?)\*\*/g, '$1')}
                    onChangeText={setResult}
                    onSelectionChange={({ nativeEvent: { selection } }) => setOutputSelection(selection)}
                    multiline
                    placeholder="Analysis will appear here..."
                    placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
                    editable={true}
                    showSoftInputOnFocus={false}
                  />
                </ScrollView>
              </View>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 48,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'SpaceMono',
  },
  modelSection: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    minHeight: 120,
    padding: 20,
    fontSize: 16,
    textAlignVertical: 'top',
    fontFamily: 'System',
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  charCountText: {
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'SpaceMono',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  resultContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  ratingCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingIcon: {
    marginRight: 12,
  },
  ratingInfo: {
    flex: 1,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreTotal: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  analysisContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  analysisScrollView: {
    maxHeight: 300,
  },
  analysisText: {
    fontSize: 16,
    lineHeight: 24,
    padding: 16,
    paddingTop: 8,
    minHeight: 120,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 120 : 50,
  },
  pickerItem: {
    height: 120,
  },
  // Legacy styles for compatibility
  inner: {
    flex: 1,
    padding: 24,
  },
  loader: {
    marginTop: 24,
  },
  scrollView: {
    flex: 1,
  },
  outputTextInput: {
    borderWidth: 0,
    padding: 0,
    minHeight: 100,
  },
});
