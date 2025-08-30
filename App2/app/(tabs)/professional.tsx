import { PERPLEXITY_API_KEY } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
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
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('sonar-pro');
  const colorScheme = useColorScheme();

  const handleFactCheck = async () => {
    if (!text) {
      setResult('Please enter some text to fact-check.');
      return;
    }
    setLoading(true);
    setResult('');

    if (model.startsWith('sonar')) {
      const url = 'https://api.perplexity.ai/chat/completions';
      const headers = {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      };

      const payload = {
        model: model,
        messages: [
          { role: 'system', content: 'Be precise and factual.' },
          { role: 'user', content: `Fact-check the following text: "${text}"` },
        ],
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
          setResult(data.choices[0].message.content);
        } else {
          console.error('Unexpected API response structure:', data);
          setResult('Sorry, something went wrong while processing the result.');
        }
      } catch (error) {
        console.error('Error during fact-check:', error);
        setResult('Sorry, an error occurred while trying to fact-check.');
      } finally {
        setLoading(false);
      }
    } else {
      setResult(`The ${model} model is not yet implemented.`);
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;

    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <Text key={index} style={{ fontWeight: 'bold' }}>{part.slice(2, -2)}</Text>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <Text key={index} style={{ fontStyle: 'italic' }}>{part.slice(1, -1)}</Text>;
      }
      return <Text key={index}>{part}</Text>;
    });
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
    input: {
      borderColor: colorScheme === 'dark' ? '#444' : '#CED4DA',
      backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#FFFFFF',
      color: colorScheme === 'dark' ? '#FFFFFF' : '#212529',
    },
    resultContainer: {
      backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#FFFFFF',
    },
    resultText: {
      color: colorScheme === 'dark' ? '#EAEAEA' : '#343A40',
    },
    pickerContainer: {
      borderColor: colorScheme === 'dark' ? '#444' : '#CED4DA',
      backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#FFFFFF',
    },
    picker: {
      color: colorScheme === 'dark' ? '#FFFFFF' : '#212529',
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, themeStyles.container]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={[styles.title, themeStyles.title]}>Fact-Checker AI</Text>
            <Text style={[styles.subtitle, themeStyles.subtitle]}>Professional Mode</Text>
          </View>
          <View style={[styles.pickerContainer, themeStyles.pickerContainer]}>
            <Picker
              selectedValue={model}
              style={[styles.picker, themeStyles.picker]}
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue) => setModel(itemValue)}
            >
              <Picker.Item label="Sonar Pro" value="sonar-pro" />
              <Picker.Item label="Sonar Free" value="sonar-free" />
              <Picker.Item label="Gemini" value="gemini" />
              <Picker.Item label="ChatGPT" value="chatgpt" />
              <Picker.Item label="Claude" value="claude" />
            </Picker>
          </View>
          <TextInput
            style={[styles.input, themeStyles.input]}
            placeholder="Enter text to fact-check..."
            placeholderTextColor={colorScheme === 'dark' ? '#A9A9A9' : '#6C757D'}
            onChangeText={setText}
            value={text}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleFactCheck} disabled={loading}>
            <Ionicons name="shield-checkmark-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Fact-Check</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />}
          {result ? (
            <ScrollView style={[styles.resultContainer, themeStyles.resultContainer]}>
              <View>
                <Text style={[styles.resultText, themeStyles.resultText]}>{renderFormattedText(result)}</Text>
              </View>
            </ScrollView>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 48,
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
  },
  input: {
    width: '100%',
    height: 180,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'SpaceMono',
  },
  loader: {
    marginTop: 24,
  },
  resultContainer: {
    flex: 1,
    marginTop: 24,
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 24,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 120 : 50,
  },
  pickerItem: {
    height: 120,
  },
});
