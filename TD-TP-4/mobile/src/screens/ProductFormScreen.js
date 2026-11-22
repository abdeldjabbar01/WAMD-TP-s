import { useLayoutEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { productsApi, getErrorMessage } from '../services/api'
import { colors } from '../theme'

// Admin-only screen. Uses protected endpoints (POST/PUT /products) with the JWT.
export default function ProductFormScreen({ route, navigation }) {
  const product = route.params?.product
  const [form, setForm] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product ? String(product.price) : '',
    stock: product ? String(product.stock ?? 0) : '0',
    imageUrl: product?.imageUrl || '',
    description: product?.description || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  useLayoutEffect(() => {
    navigation.setOptions({ title: product ? 'Edit product' : 'Add product' })
  }, [navigation, product])

  const save = async () => {
    const { name, category, imageUrl, description } = form
    if (!name.trim() || !category.trim() || !imageUrl.trim() || !description.trim()) {
      return setError('Please fill in all the fields.')
    }
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(stock) || stock < 0) {
      return setError('Price and stock must be positive numbers.')
    }
    setError('')
    setSaving(true)
    const payload = { name: name.trim(), category: category.trim(), imageUrl: imageUrl.trim(), description: description.trim(), price, stock }
    try {
      if (product) await productsApi.update(product._id, payload)
      else await productsApi.create(payload)
      Alert.alert('Saved', product ? 'Product updated successfully.' : 'Product created successfully.')
      navigation.popToTop()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <FormField label="Product name" value={form.name} onChangeText={set('name')} />
        <FormField label="Category" value={form.category} onChangeText={set('category')} />
        <FormField label="Price (DA)" value={form.price} onChangeText={set('price')} keyboardType="numeric" />
        <FormField label="Stock" value={form.stock} onChangeText={set('stock')} keyboardType="numeric" />
        <FormField label="Image URL" value={form.imageUrl} onChangeText={set('imageUrl')} autoCapitalize="none"
          placeholder="/images/perfume-1.jpg or https://…" />
        <FormField label="Description" value={form.description} onChangeText={set('description')} multiline />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={product ? 'Save changes' : 'Create product'} onPress={save} loading={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  error: { color: colors.danger, marginBottom: 12, fontSize: 13 },
})
