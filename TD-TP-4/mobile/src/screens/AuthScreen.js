import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { authApi, getErrorMessage } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { colors } from '../theme'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// One form used by both the Login and Register screens.
export default function AuthScreen({ navigation, mode }) {
  const isRegister = mode === 'register'
  const { signIn } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validate = () => {
    if (isRegister && name.trim().length < 2) return 'Name must contain at least 2 characters.'
    if (!EMAIL_RE.test(email.trim())) return 'Please enter a valid email address.'
    if (password.length < 6) return 'Password must contain at least 6 characters.'
    return ''
  }

  const submit = async () => {
    const problem = validate()
    if (problem) return setError(problem)
    setError('')
    setLoading(true)
    try {
      const result = isRegister
        ? await authApi.register(name.trim(), email.trim(), password)
        : await authApi.login(email.trim(), password)
      await signIn({ token: result.token, user: result.user })
      navigation.popToTop()
      navigation.navigate('Tabs', { screen: 'Products' })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>PARFUMI</Text>
        <Text style={styles.title}>{isRegister ? 'Create an account' : 'Welcome back'}</Text>
        <Text style={styles.muted}>
          {isRegister ? 'Create your account to get started.' : 'Sign in to manage your store access.'}
        </Text>

        <View style={{ marginTop: 24 }}>
          {isRegister && (
            <FormField label="Full name" value={name} onChangeText={setName} autoComplete="name" />
          )}
          <FormField label="Email address" value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" />
          <FormField label="Password" value={password} onChangeText={setPassword} secureTextEntry
            autoCapitalize="none" autoComplete={isRegister ? 'new-password' : 'current-password'} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title={isRegister ? 'Create account' : 'Sign in'} onPress={submit} loading={loading} />
        </View>

        <Text style={styles.switch} onPress={() => navigation.replace(isRegister ? 'Login' : 'Register')}>
          {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingTop: 32 },
  logo: { fontSize: 22, fontWeight: '700', letterSpacing: 5, color: colors.ink, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink },
  muted: { color: colors.muted, marginTop: 4, fontSize: 14 },
  error: { color: colors.danger, marginBottom: 12, fontSize: 13 },
  switch: { color: colors.blue, textAlign: 'center', marginTop: 24, fontWeight: '500' },
})
