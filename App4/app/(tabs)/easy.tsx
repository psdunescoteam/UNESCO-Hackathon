import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
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

  const PERPLEXITY_API_KEY = (Constants as any).expoConfig?.extra?.PERPLEXITY_API_KEY;

  const handleAnalysis = async () => {
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
      setError('Please enter or select text to analyze.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setAnalysis('');
    setScore(null);

    const systemPrompt = `
      You are a media literacy analysis AI. Analyze the following text for factual accuracy and potential misinformation.
      Respond in a JSON format with two keys:
      1. "score": An integer from 0 (completely false/misleading) to 100 (completely true/reliable).
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
    return 'Analyze';
  };

  const themeStyles = {
    container: {
      backgroundColor: isDarkMode ? '#0a0a0a' : '#f8f9fa',
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
    subtitle: {
      color: isDarkMode ? '#b0b0b0' : '#6c757d',
    },
    ratingBox: {
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0',
      borderColor: isDarkMode ? '#444' : '#ddd',
    },
    ratingLabel: {
      color: isDarkMode ? '#ccc' : '#555',
    },
    logoContainer: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    },
    inputSection: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    },
    inputContainer: {
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    errorContainer: {
      backgroundColor: isDarkMode ? 'rgba(220,53,69,0.1)' : 'rgba(220,53,69,0.05)',
    },
    resultsSection: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    },
    ratingCard: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    analysisContainer: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    analysisText: {
      color: isDarkMode ? '#EAEAEA' : '#333333',
    },
    loadingContainer: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    },
    placeholderContainer: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    },
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, themeStyles.container]}>
        <LinearGradient
          colors={isDarkMode ? ['#0a0a0a', '#1a1a2e'] : ['#f8f9fa', '#e3f2fd']}
          style={styles.gradient}
        >
          <BlurView intensity={20} tint={isDarkMode ? 'dark' : 'light'} style={styles.blur}>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
              {/* Header Section */}
              <View style={styles.headerSection}>
                <View style={[styles.logoContainer, themeStyles.logoContainer]}>
                  <Ionicons name="shield-checkmark" size={32} color="#007BFF" />
                </View>
                <Text style={[styles.title, themeStyles.title]}>Easy Analysis</Text>
                <Text style={[styles.subtitle, themeStyles.subtitle]}>
                  Quick and simple media verification
                </Text>
              </View>

              {/* Input Section */}
              <View style={[styles.inputSection, themeStyles.inputSection]}>
                <Text style={[styles.sectionTitle, themeStyles.title]}>Your Text</Text>
                <View style={[styles.inputContainer, themeStyles.inputContainer]}>
                  <TextInput
                    style={[styles.input, themeStyles.input]}
                    placeholder="Enter text to analyze... Select specific text to check only that part."
                    placeholderTextColor={themeStyles.placeholder.color}
                    multiline
                    onChangeText={setText}
                    value={text}
                    onSelectionChange={({ nativeEvent: { selection } }) => setSelection(selection)}
                  />
                </View>
                
                <TouchableOpacity 
                  style={[styles.checkButton, { opacity: loading ? 0.7 : 1 }]} 
                  onPress={handleAnalysis} 
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#007BFF', '#0056b3']}
                    style={styles.buttonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Ionicons name="search" size={18} color="#ffffff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>{getButtonText()}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Error Display */}
              {error && (
                <View style={[styles.errorContainer, themeStyles.errorContainer]}>
                  <Ionicons name="warning" size={16} color="#dc3545" />
                  <Text style={[styles.errorText, themeStyles.errorText]}>{error}</Text>
                </View>
              )}

              {/* Results Section */}
              {(analysis || score !== null) && (
                <View style={[styles.resultsSection, themeStyles.resultsSection]}>
                  <Text style={[styles.sectionTitle, themeStyles.title]}>Analysis</Text>
                  
                  {/* Rating Card */}
                  <View style={[styles.ratingCard, themeStyles.ratingCard]}>
                    <View style={styles.ratingHeader}>
                      <View style={styles.ratingInfo}>
                        <Text style={[styles.ratingLabel, themeStyles.subtitle]}>Truthfulness Score</Text>
                        <Text style={[styles.ratingValue, { color: rating.color }]}>{rating.text}</Text>
                      </View>
                      {score !== null && (
                        <View style={[styles.scoreCircle, { borderColor: rating.color }]}>
                          <Text style={[styles.scoreText, { color: rating.color }]}>{score}</Text>
                          <Text style={[styles.scoreTotal, { color: rating.color }]}>/100</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Analysis Container */}
                  <View style={[styles.analysisContainer, themeStyles.analysisContainer]}>
                    <Text style={[styles.analysisLabel, themeStyles.subtitle]}>Detailed Analysis</Text>
                    <TextInput
                      style={[styles.analysisText, themeStyles.analysisText]}
                      value={analysis.replace(/\*\*(.*?)\*\*/g, '$1')}
                      multiline
                      editable={false}
                      showSoftInputOnFocus={false}
                      onSelectionChange={({ nativeEvent: { selection } }) => setOutputSelection(selection)}
                      placeholder="Analysis will appear here..."
                      placeholderTextColor={themeStyles.placeholder.color}
                    />
                  </View>
                </View>
              )}

              {/* Loading State */}
              {loading && !analysis && (
                <View style={[styles.loadingContainer, themeStyles.loadingContainer]}>
                  <ActivityIndicator size="large" color="#007BFF" />
                  <Text style={[styles.loadingText, themeStyles.subtitle]}>Analyzing your text...</Text>
                </View>
              )}

              {/* Placeholder when no results */}
              {!loading && !analysis && !score && (
                <View style={[styles.placeholderContainer, themeStyles.placeholderContainer]}>
                  <Ionicons name="document-text-outline" size={48} color="#ccc" />
                  <Text style={[styles.placeholderText, themeStyles.placeholder]}>
                                        Enter text above and tap "Analyze" to get started
                  </Text>
                </View>
              )}
            </ScrollView>
          </BlurView>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  blur: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  input: {
    minHeight: 120,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  checkButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  resultsSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  ratingCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderWidth: 2,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreTotal: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  analysisContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  analysisLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  // Legacy styles (keeping for compatibility)
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
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
  ratingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },
  outputTextInput: {
    borderWidth: 0,
    padding: 0,
    minHeight: 100,
  },
});
