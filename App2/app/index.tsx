import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

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
    featureText: {
      color: colorScheme === 'dark' ? '#EAEAEA' : '#343A40',
    },
    button: {
      backgroundColor: '#007BFF',
    },
    buttonText: {
      color: '#FFFFFF',
    },
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Ionicons name="shield-checkmark-outline" size={80} color="#007BFF" />
      <Text style={[styles.title, themeStyles.title]}>Welcome to Fact-Checker AI</Text>
      <Text style={[styles.subtitle, themeStyles.subtitle]}>Your trusted source for verifying information.</Text>

      <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <Ionicons name="build-outline" size={32} color="#007BFF" />
          <Text style={[styles.featureText, themeStyles.featureText]}>
            <Text style={styles.bold}>Easy Mode:</Text> Quickly check facts with our default AI model.
          </Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="business-outline" size={32} color="#007BFF" />
          <Text style={[styles.featureText, themeStyles.featureText]}>
            <Text style={styles.bold}>Professional Mode:</Text> Choose from a variety of AI models for more in-depth analysis.
          </Text>
        </View>
      </View>

      <Link href="/(tabs)/easy" style={[styles.button, themeStyles.button]}>
        <Text style={[styles.buttonText, themeStyles.buttonText]}>Get Started</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    marginLeft: 16,
    fontSize: 16,
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
});

