import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function OffersScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={250}
          color="#FF4500"
          name="gift.fill"
          style={styles.headerImage}
        />
      }
    >
      {/* Header */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">🔥 Exclusive RAPS Offers</ThemedText>
      </ThemedView>
      <ThemedText style={{ marginBottom: 20 }}>
        Grab the best deals on gaming sessions, snacks & merchandise!
      </ThemedText>

      {/* Offers */}
      <Collapsible title="🎮 Weekend Gaming Offer">
        <ThemedText>
          Book 2 hours of PS5 gaming and get 30 minutes **FREE** every Saturday & Sunday.
        </ThemedText>
      </Collapsible>

      <Collapsible title="🍔 Gamer’s Snack Combo">
        <ThemedText>
          Get a burger + cold drink at just **₹99** when you book a gaming session.
        </ThemedText>
      </Collapsible>

      <Collapsible title="👕 RAPS Merch Sale">
        <ThemedText>
          Flat **20% OFF** on RAPS T-shirts and hoodies this month.
        </ThemedText>
      </Collapsible>

      <Collapsible title="🏆 Tournament Discount">
        <ThemedText>
          Early bird registrations for gaming tournaments get **₹200 OFF**.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -70,
    left: -20,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
