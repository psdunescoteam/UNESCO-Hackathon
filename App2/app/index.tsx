import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ColorValue, StyleSheet, Text, TouchableOpacity, View, useColorScheme, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

const FloatingCircle = ({ index, colors }: { index: number; colors: readonly [ColorValue, ColorValue, ...ColorValue[]] }) => {
  const { width, height } = useWindowDimensions();
  const size = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const randomDelay = index * 1000 + Math.random() * 1000;
    const randomDuration = 15000 + Math.random() * 10000;

    size.value = Math.random() * 150 + 50;
    x.value = Math.random() * (width - size.value);
    y.value = Math.random() * (height - size.value);

    opacity.value = withDelay(randomDelay, withTiming(Math.random() * 0.3 + 0.1, { duration: 1000 }));

    x.value = withRepeat(
      withTiming(Math.random() * (width - size.value), { duration: randomDuration, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    y.value = withRepeat(
      withTiming(Math.random() * (height - size.value), { duration: randomDuration, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [width, height, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: size.value,
      height: size.value,
      borderRadius: size.value / 2,
      opacity: opacity.value,
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });

  return (
    <Animated.View style={[styles.circle, animatedStyle]}>
      <LinearGradient colors={colors} style={styles.gradient} />
    </Animated.View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const themeStyles = {
    container: {
      backgroundColor: isDarkMode ? '#0a0a0a' : '#f8f9fa',
    },
    blur: {
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
    },
    title: {
      color: isDarkMode ? '#ffffff' : '#212529',
    },
    subtitle: {
      color: isDarkMode ? '#b0b0b0' : '#6c757d',
    },
    featureText: {
      color: isDarkMode ? '#e0e0e0' : '#495057',
    },
    buttonText: {
      color: '#ffffff',
    },
    heroSection: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    },
    featureCard: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    secondaryButton: {
      backgroundColor: isDarkMode ? 'rgba(0,123,255,0.1)' : 'rgba(0,123,255,0.05)',
      borderColor: '#007BFF',
    },
  };

  const circleColors: [string, string][] = isDarkMode
    ? [['#3a2d80', '#5b4ab3'], ['#2a5b8a', '#4a8ac3'], ['#8a2a7b', '#c34ab3']]
    : [['#007BFF', '#00C6FF'], ['#4A90E2', '#81C7F4'], ['#a2d2ff', '#bde0fe']];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View style={StyleSheet.absoluteFill}>
        {[...Array(3)].map((_, i) => (
          <FloatingCircle key={i} index={i} colors={circleColors[i]} />
        ))}
      </View>
      <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={styles.blur}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoBackground, { backgroundColor: isDarkMode ? '#1a1a2e' : '#ffffff' }]}>
              <Ionicons name="shield-checkmark" size={64} color="#007BFF" />
            </View>
            <Text style={[styles.appName, themeStyles.title]}>FactCheck AI</Text>
            <Text style={[styles.tagline, themeStyles.subtitle]}>Powered by Advanced AI Models</Text>
          </View>

          <View style={[styles.heroSection, themeStyles.heroSection]}>
            <Text style={[styles.title, themeStyles.title]}>Verify Information</Text>
            <Text style={[styles.title, themeStyles.title]}>with Confidence</Text>
            <Text style={[styles.subtitle, themeStyles.subtitle]}>
              Professional fact-checking powered by multiple AI models. Highlight any text to verify specific claims instantly.
            </Text>
          </View>

          <View style={styles.featuresGrid}>
            <View style={[styles.featureCard, themeStyles.featureCard]}>
              <View style={[styles.featureIcon, { backgroundColor: '#007BFF20' }]}>
                <Ionicons name="flash" size={28} color="#007BFF" />
              </View>
              <Text style={[styles.featureTitle, themeStyles.title]}>Quick Check</Text>
              <Text style={[styles.featureDescription, themeStyles.subtitle]}>
                Instant fact-checking with smart text selection
              </Text>
            </View>

            <View style={[styles.featureCard, themeStyles.featureCard]}>
              <View style={[styles.featureIcon, { backgroundColor: '#28a74520' }]}>
                <Ionicons name="analytics" size={28} color="#28a745" />
              </View>
              <Text style={[styles.featureTitle, themeStyles.title]}>Accuracy Score</Text>
              <Text style={[styles.featureDescription, themeStyles.subtitle]}>
                Get truthfulness ratings from 0-100
              </Text>
            </View>

            <View style={[styles.featureCard, themeStyles.featureCard]}>
              <View style={[styles.featureIcon, { backgroundColor: '#6f42c120' }]}>
                <Ionicons name="options" size={28} color="#6f42c1" />
              </View>
              <Text style={[styles.featureTitle, themeStyles.title]}>Multiple AIs</Text>
              <Text style={[styles.featureDescription, themeStyles.subtitle]}>
                Choose from various AI models for analysis
              </Text>
            </View>

            <View style={[styles.featureCard, themeStyles.featureCard]}>
              <View style={[styles.featureIcon, { backgroundColor: '#fd7e1420' }]}>
                <Ionicons name="search" size={28} color="#fd7e14" />
              </View>
              <Text style={[styles.featureTitle, themeStyles.title]}>Deep Analysis</Text>
              <Text style={[styles.featureDescription, themeStyles.subtitle]}>
                Detailed breakdowns with source verification
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Animated.View
              entering={require('react-native-reanimated').FadeInUp.delay(500)}
              style={styles.primaryButtonWrapper}
            >
              <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(tabs)/easy')}>
                <LinearGradient
                  colors={['#007BFF', '#0056b3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
                  <Text style={styles.primaryButtonText}>Start Fact-Checking</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, themeStyles.secondaryButton]} 
              onPress={() => router.push('/(tabs)/professional')}
            >
              <Ionicons name="settings" size={18} color="#007BFF" style={styles.buttonIcon} />
              <Text style={[styles.secondaryButtonText, { color: '#007BFF' }]}>Professional Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle: {
    position: 'absolute',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  heroSection: {
    padding: 24,
    borderRadius: 16,
    marginVertical: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007BFF',
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
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  primaryButtonWrapper: {
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

