import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useApp } from "../../src/contexts/AppContext";
import TalkAILogo from "../../src/components/TalkAILogo";

export default function HomeScreen() {
  const { user, sessionStats, isLoading } = useApp();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TalkAILogo width={100} height={30} style={styles.logo} />
          <View style={styles.brandInfo}>
            <Text style={styles.brandTagline}>Your mental health companion</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.notificationContainer}>
            <View style={styles.bellIcon}>
              <Text style={styles.bellText}>🔔</Text>
            </View>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>
      </View>

      {/* Availability Status */}
      <View style={styles.availabilityContainer}>
        <View style={styles.availabilityPill}>
          <View style={styles.availabilityDot}></View>
          <Text style={styles.availabilityText}>AI Therapist Available</Text>
        </View>
      </View>

      {/* Greeting */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingTitle}>
          Good evening, {user?.full_name?.split(' ')[0] || 'Alex'}
        </Text>
        <Text style={styles.greetingSubtitle}>How are you feeling today?</Text>
      </View>

      {/* Stats Container */}
      <View style={styles.statsContainer}>
        <View style={styles.statsWrapper}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>❤️</Text>
              </View>
              <Text style={styles.statValue}>
                {sessionStats?.moodAverage ? `${sessionStats.moodAverage}/5` : '4/5'}
              </Text>
              <Text style={styles.statLabel}>Today's Mood</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>📈</Text>
              </View>
              <Text style={styles.statValue}>
                {sessionStats?.totalWeeks || 7}
              </Text>
              <Text style={styles.statLabel}>Week Streak</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>📅</Text>
              </View>
              <Text style={styles.statValue}>
                {sessionStats?.totalSessions ? `${Math.min(sessionStats.totalSessions, 4)}/4` : '3/4'}
              </Text>
              <Text style={styles.statLabel}>Weekly Goal</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <View style={styles.actionRow}>
            <View style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>💬</Text>
              </View>
              <Text style={styles.actionTitle}>Start Chat Session</Text>
              <Text style={styles.actionSubtitle}>Begin a new therapy conversation</Text>
            </View>
            <View style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>❤️</Text>
              </View>
              <Text style={styles.actionTitle}>Log Mood</Text>
              <Text style={styles.actionSubtitle}>Track how you're feeling today</Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <View style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>📊</Text>
              </View>
              <Text style={styles.actionTitle}>View Progress</Text>
              <Text style={styles.actionSubtitle}>See your therapy journey</Text>
            </View>
            <View style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>📞</Text>
              </View>
              <Text style={styles.actionTitle}>Crisis Support</Text>
              <Text style={styles.actionSubtitle}>Get immediate help</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Sessions */}
      <View style={styles.sessionsContainer}>
        <View style={styles.sessionsHeader}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <Text style={styles.viewAllText}>View All →</Text>
        </View>
        {sessionStats?.recentSessions?.slice(0, 1).map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionContent}>
              <Text style={styles.sessionIcon}>💬</Text>
              <Text style={styles.sessionDate}>{session.date}</Text>
              <Text style={styles.sessionDuration}>{session.duration} min</Text>
              <View style={styles.sessionBadge}>
                <Text style={styles.sessionBadgeText}>{session.mood}</Text>
              </View>
            </View>
          </View>
        )) || (
          <View style={styles.sessionCard}>
            <View style={styles.sessionContent}>
              <Text style={styles.sessionIcon}>💬</Text>
              <Text style={styles.sessionDate}>1/19/2024</Text>
              <Text style={styles.sessionDuration}>30 min</Text>
              <View style={styles.sessionBadge}>
                <Text style={styles.sessionBadgeText}>good</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background like web app
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    marginRight: 8,
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  brandInfo: {
    gap: 2,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  brandTagline: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationContainer: {
    position: 'relative',
  },
  bellIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellText: {
    color: '#6b7280',
    fontSize: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  availabilityContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  availabilityPill: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  availabilityText: {
    color: '#15803d',
    fontSize: 14,
    fontWeight: '500',
  },
  greetingContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // White with transparency like web app
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // White with transparency
    borderRadius: 12,
    padding: 16,
    shadowColor: '#4ECDC4', // Cyan glow like web app
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(78, 205, 196, 0.2)', // Cyan with transparency
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIconText: {
    color: '#4ECDC4', // Cyan color
    fontSize: 18,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // White with transparency like web app
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(78, 205, 196, 0.2)', // Cyan with transparency
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIconText: {
    color: '#4ECDC4', // Cyan color
    fontSize: 20,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  actionSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  sessionsContainer: {
    paddingHorizontal: 24,
  },
  sessionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#4ECDC4', // Cyan color
    fontSize: 16,
    fontWeight: '500',
  },
  sessionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // White with transparency
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionIcon: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  sessionDate: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  sessionDuration: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  sessionBadge: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(78, 205, 196, 0.2)', // Cyan with transparency
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sessionBadgeText: {
    color: '#4ECDC4', // Cyan color
    fontSize: 12,
    fontWeight: '500',
  },
});