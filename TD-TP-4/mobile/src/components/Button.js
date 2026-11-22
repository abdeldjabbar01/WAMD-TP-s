import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { colors } from '../theme'

export default function Button({ title, onPress, loading, disabled, variant = 'primary', style }) {
  const isDisabled = disabled || loading
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : colors.blue} />
      ) : (
        <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>{title}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: { minHeight: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  primary: { backgroundColor: colors.blue },
  danger: { backgroundColor: colors.danger },
  outline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.blue },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  text: { color: '#fff', fontSize: 15, fontWeight: '600' },
  textOutline: { color: colors.blue },
})
