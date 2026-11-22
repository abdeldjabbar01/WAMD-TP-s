import { StyleSheet, Text, TextInput, View } from 'react-native'
import { colors } from '../theme'

export default function FormField({ label, style, ...inputProps }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, inputProps.multiline && { height: 90, textAlignVertical: 'top' }, style]}
        {...inputProps}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { color: colors.ink, fontSize: 13, fontWeight: '500', marginBottom: 6 },
  input: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.ink, textAlign: 'left',
  },
})
