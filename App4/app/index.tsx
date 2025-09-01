import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ColorValue, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme, useWindowDimensions } from 'react-native';
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
  const { width, height } = useWindowDimensions();
  
  // Responsive dimensions
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 414;
  const isLargeScreen = width >= 414;

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
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { minHeight: height }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { paddingHorizontal: isSmallScreen ? 16 : 24 }]}>
            
            {/* Logo Section */}
            <View style={[styles.logoContainer, { marginTop: height * 0.08 }]}>
              <View style={[
                styles.logoBackground, 
                { 
                  backgroundColor: isDarkMode ? '#1a1a2e' : '#ffffff',
                  width: isSmallScreen ? 100 : 120,
                  height: isSmallScreen ? 100 : 120,
                  borderRadius: isSmallScreen ? 50 : 60,
                }
              ]}>
                <Ionicons name="shield-checkmark" size={isSmallScreen ? 48 : 64} color="#007BFF" />
              </View>
              <Text style={[
                styles.appName, 
                themeStyles.title,
                { fontSize: isSmallScreen ? 28 : isMediumScreen ? 32 : 36 }
              ]}>
                MILLens+
              </Text>
              <Text style={[
                styles.tagline, 
                themeStyles.subtitle,
                { fontSize: isSmallScreen ? 14 : 16 }
              ]}>
                Media & Information Literacy Lens Plus
              </Text>
            </View>

            {/* Hero Section */}
            <View style={[
              styles.heroSection, 
              themeStyles.heroSection,
              { marginVertical: isSmallScreen ? 16 : 24 }
            ]}>
              <Text style={[
                styles.heroTitle, 
                themeStyles.title,
                { fontSize: isSmallScreen ? 22 : isMediumScreen ? 26 : 30 }
              ]}>
                Verify Information
              </Text>
              <Text style={[
                styles.heroTitle, 
                themeStyles.title,
                { fontSize: isSmallScreen ? 22 : isMediumScreen ? 26 : 30 }
              ]}>
                with Confidence
              </Text>
              <Text style={[
                styles.heroSubtitle, 
                themeStyles.subtitle,
                { 
                  fontSize: isSmallScreen ? 14 : 16,
                  paddingHorizontal: isSmallScreen ? 8 : 16
                }
              ]}>
                Professional media literacy analysis powered by multiple AI models. Verify information accuracy and detect misinformation instantly.
              </Text>
            </View>

            {/* Features Grid */}
            <View style={[
              styles.featuresGrid,
              { gap: isSmallScreen ? 8 : 12 }
            ]}>
              <View style={[
                styles.featureCard, 
                themeStyles.featureCard,
                { width: isSmallScreen ? '47%' : '48%' }
              ]}>
                <View style={[styles.featureIcon, { backgroundColor: '#007BFF20' }]}>
                  <Ionicons name="flash" size={isSmallScreen ? 24 : 28} color="#007BFF" />
                </View>
                <Text style={[
                  styles.featureTitle, 
                  themeStyles.title,
                  { fontSize: isSmallScreen ? 14 : 16 }
                ]}>
                  Quick Check
                </Text>
                <Text style={[
                  styles.featureDescription, 
                  themeStyles.subtitle,
                  { fontSize: isSmallScreen ? 11 : 12 }
                ]}>
                  Instant media analysis with smart text selection
                </Text>
              </View>

              <View style={[
                styles.featureCard, 
                themeStyles.featureCard,
                { width: isSmallScreen ? '47%' : '48%' }
              ]}>
                <View style={[styles.featureIcon, { backgroundColor: '#28a74520' }]}>
                  <Ionicons name="analytics" size={isSmallScreen ? 24 : 28} color="#28a745" />
                </View>
                <Text style={[
                  styles.featureTitle, 
                  themeStyles.title,
                  { fontSize: isSmallScreen ? 14 : 16 }
                ]}>
                  Accuracy Score
                </Text>
                <Text style={[
                  styles.featureDescription, 
                  themeStyles.subtitle,
                  { fontSize: isSmallScreen ? 11 : 12 }
                ]}>
                  Get truthfulness ratings from 0-100
                </Text>
              </View>

              <View style={[
                styles.featureCard, 
                themeStyles.featureCard,
                { width: isSmallScreen ? '47%' : '48%' }
              ]}>
                <View style={[styles.featureIcon, { backgroundColor: '#6f42c120' }]}>
                  <Ionicons name="options" size={isSmallScreen ? 24 : 28} color="#6f42c1" />
                </View>
                <Text style={[
                  styles.featureTitle, 
                  themeStyles.title,
                  { fontSize: isSmallScreen ? 14 : 16 }
                ]}>
                  Multiple AIs
                </Text>
                <Text style={[
                  styles.featureDescription, 
                  themeStyles.subtitle,
                  { fontSize: isSmallScreen ? 11 : 12 }
                ]}>
                  Choose from various AI models for analysis
                </Text>
              </View>

              <View style={[
                styles.featureCard, 
                themeStyles.featureCard,
                { width: isSmallScreen ? '47%' : '48%' }
              ]}>
                <View style={[styles.featureIcon, { backgroundColor: '#fd7e1420' }]}>
                  <Ionicons name="search" size={isSmallScreen ? 24 : 28} color="#fd7e14" />
                </View>
                <Text style={[
                  styles.featureTitle, 
                  themeStyles.title,
                  { fontSize: isSmallScreen ? 14 : 16 }
                ]}>
                  Deep Analysis
                </Text>
                <Text style={[
                  styles.featureDescription, 
                  themeStyles.subtitle,
                  { fontSize: isSmallScreen ? 11 : 12 }
                ]}>
                  Detailed breakdowns with source verification
                </Text>
              </View>
            </View>

            {/* Button Container */}
            <View style={[
              styles.buttonContainer,
              { 
                marginTop: isSmallScreen ? 24 : 32,
                marginBottom: isSmallScreen ? 32 : 48,
                paddingHorizontal: isSmallScreen ? 0 : 16
              }
            ]}>
              <Animated.View
                entering={require('react-native-reanimated').FadeInUp.delay(500)}
                style={styles.primaryButtonWrapper}
              >
                <TouchableOpacity 
                  style={[
                    styles.primaryButton,
                    { 
                      paddingVertical: isSmallScreen ? 14 : 16,
                      paddingHorizontal: isSmallScreen ? 24 : 32
                    }
                  ]} 
                  onPress={() => router.push('/(tabs)/easy')}
                >
                  <LinearGradient
                    colors={['#007BFF', '#0056b3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.buttonGradient,
                      { 
                        paddingVertical: isSmallScreen ? 14 : 16,
                        paddingHorizontal: isSmallScreen ? 24 : 32
                      }
                    ]}
                  >
                    <Ionicons name="arrow-forward" size={isSmallScreen ? 18 : 20} color="white" style={styles.buttonIcon} />
                    <Text style={[
                      styles.primaryButtonText,
                      { fontSize: isSmallScreen ? 16 : 18 }
                    ]}>
                      Start Analysis
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
              
              <TouchableOpacity 
                style={[
                  styles.secondaryButton, 
                  themeStyles.secondaryButton,
                  { 
                    paddingVertical: isSmallScreen ? 14 : 16,
                    paddingHorizontal: isSmallScreen ? 24 : 32
                  }
                ]} 
                onPress={() => router.push('/(tabs)/professional')}
              >
                <Ionicons name="settings" size={isSmallScreen ? 16 : 18} color="#007BFF" style={styles.buttonIcon} />
                <Text style={[
                  styles.secondaryButtonText, 
                  { 
                    color: '#007BFF',
                    fontSize: isSmallScreen ? 16 : 18
                  }
                ]}>
                  Professional Mode
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  appName: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    textAlign: 'center',
    opacity: 0.8,
  },
  heroSection: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heroTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
    marginTop: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 32,
    width: '100%',
  },
  featureCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  secondaryButton: {
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
  buttonGradient: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonWrapper: {
    marginBottom: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  // Legacy styles for backward compatibility
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
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  heroTitleLegacy: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureIconText: {
    fontSize: 20,
  },
});

