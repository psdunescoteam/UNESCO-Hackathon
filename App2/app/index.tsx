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
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
    blur: {
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
    },
    title: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    subtitle: {
      color: isDarkMode ? '#A9A9A9' : '#6C757D',
    },
    featureText: {
      color: isDarkMode ? '#EAEAEA' : '#343A40',
    },
    buttonText: {
      color: '#FFFFFF',
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

          <Animated.View
            entering={require('react-native-reanimated').FadeInUp.delay(500)}
          >
            <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/easy')}>
              <LinearGradient
                colors={['#007BFF', '#00C6FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={[styles.buttonText, themeStyles.buttonText]}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
});

