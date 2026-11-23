import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import Button from './Button'
import { colors } from '../theme'

export function Loading({ label = 'Loading…' }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.blue} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  )
}

export function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.muted}>{message}</Text>
      {onRetry && <Button title="Try again" onPress={onRetry} style={{ marginTop: 16, minWidth: 140 }} />}
    </View>
  )
}

export function EmptyView({ title, message }) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorTitle}>{title}</Text>
      {message ? <Text style={styles.muted}>{message}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  muted: { color: colors.muted, textAlign: 'center', fontSize: 14 },
  errorTitle: { color: colors.ink, fontSize: 17, fontWeight: '600', textAlign: 'center' },
})
