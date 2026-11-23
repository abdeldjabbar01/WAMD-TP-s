import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../components/Button'
import { ErrorView, Loading } from '../components/StateViews'
import { productsApi, getErrorMessage } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { addToCart } from '../store/cartSlice'
import { colors } from '../theme'
import { formatPrice } from '../utils/format'
import { getImageSource } from '../utils/images'
import { toCartItem } from '../utils/cart'

export default function ProductDetailsScreen({ route, navigation }) {
  const { productId, product: initial } = route.params
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets()
  const { isAdmin } = useAuth()
  const [product, setProduct] = useState(initial || null)
  const [loading, setLoading] = useState(!initial)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [deleting, setDeleting] = useState(false)
  const [added, setAdded] = useState(false)

  const load = useCallback(async () => {
    try {
      setProduct(await productsApi.get(productId))
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => { load() }, [load])

  useLayoutEffect(() => {
    navigation.setOptions({ title: '' })
  }, [navigation])

  const confirmDelete = () => {
    Alert.alert('Delete product', `Delete "${product.name}" from the store?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true)
          try {
            await productsApi.remove(product._id)
            navigation.goBack()
          } catch (err) {
            Alert.alert('Could not delete', getErrorMessage(err))
            setDeleting(false)
          }
        },
      },
    ])
  }

  if (loading) return <Loading label="Loading fragrance…" />
  if (!product) {
    return <ErrorView message={error || 'Product not found.'} onRetry={() => { setLoading(true); load() }} />
  }

  const stock = Math.max(0, Number(product.stock) || 0)
  const outOfStock = stock <= 0
  const total = Number(product.price || 0) * quantity

  const handleAdd = () => {
    if (outOfStock) return
    dispatch(addToCart({ ...toCartItem(product), quantity }))
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTopLine}>
            <Text style={styles.eyebrow}>PARFUMI  /  THE COLLECTION</Text>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{product.category || 'FRAGRANCE'}</Text>
            </View>
          </View>
          <View style={styles.imageStage}>
            <View style={styles.imageHalo} />
            <Image
              source={getImageSource(product.imageUrl)}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.imageCaption}>
            <Text style={styles.imageCaptionText}>A CLOSER LOOK</Text>
            <View style={styles.captionLine} />
          </View>
        </View>

        <View style={styles.content}>
          {error ? <Text style={styles.error}>Showing saved product details. {error}</Text> : null}

          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>{String(product.category || 'FRAGRANCE').toUpperCase()}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <View style={styles.priceAndStock}>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              <View style={styles.availability}>
                <View style={[styles.statusDot, outOfStock && styles.statusDotOut]} />
                <Text style={[styles.stockText, outOfStock && styles.stockTextOut]}>
                  {outOfStock ? 'Currently unavailable' : `${stock} available`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>THE FRAGRANCE</Text>
            <Text style={styles.sectionTitle}>A little about this scent.</Text>
            <Text style={styles.description}>
              {product.description || 'No description has been added for this fragrance yet.'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionEyebrow}>PRODUCT INFORMATION</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{product.category || '—'}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Availability</Text>
              <Text style={[styles.infoValue, outOfStock && styles.stockTextOut]}>
                {outOfStock ? 'Out of stock' : 'In stock'}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Units available</Text>
              <Text style={styles.infoValue}>{stock}</Text>
            </View>
          </View>

          {isAdmin && (
            <View style={styles.adminActions}>
              <Button
                title="Edit fragrance"
                variant="outline"
                style={{ flex: 1 }}
                onPress={() => navigation.navigate('ProductForm', { product })}
              />
              <Button
                title="Delete"
                variant="danger"
                style={{ flex: 1 }}
                loading={deleting}
                onPress={confirmDelete}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {!isAdmin && (
        <View style={[styles.purchaseBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.quantityControl}>
            <Pressable
              onPress={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={quantity <= 1 || outOfStock}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={17} color={quantity <= 1 ? '#BFC3CA' : colors.ink} />
            </Pressable>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity((current) => Math.min(stock, current + 1))}
              disabled={quantity >= stock || outOfStock}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={17} color={quantity >= stock ? '#BFC3CA' : colors.ink} />
            </Pressable>
          </View>
          <Pressable
            onPress={handleAdd}
            disabled={outOfStock}
            style={({ pressed }) => [styles.addToBag, outOfStock && styles.addToBagDisabled, pressed && !outOfStock && styles.addToBagPressed]}
          >
            <View style={styles.addToBagTextGroup}>
              <Text style={styles.addToBagTitle}>{added ? 'Added to bag' : outOfStock ? 'Unavailable' : 'Add to bag'}</Text>
              <Text style={styles.addToBagPrice}>{formatPrice(total)}</Text>
            </View>
            <Ionicons name={added ? 'checkmark' : 'bag-add-outline'} size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 28 },
  hero: {
    marginHorizontal: 14,
    marginTop: 8,
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 13,
    backgroundColor: '#FFFFF',
    borderWidth: 5,
    borderRadius: 25,
    borderColor: '#F4F5F6',
  
  },
  heroTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: '#FFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 1.35 },
  categoryPill: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6 },
  categoryPillText: { color: '#555C66', fontSize: 9, fontWeight: '800', letterSpacing: 0.85, textTransform: 'uppercase' },
  imageStage: { height: 272, marginTop: 6, alignItems: 'center', justifyContent: 'center' },
  imageHalo: {
    position: 'absolute',
    width: 205,
    height: 205,
    borderRadius: 110,
    backgroundColor: '#FFFFF',
  },
  productImage: { width: '82%', height: '96%' },
  imageCaption: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  imageCaptionText: { color: '#969BA3', fontSize: 8, fontWeight: '800', letterSpacing: 1.4 },
  captionLine: { width: 25, height: 1, backgroundColor: '#C8CBD0' },
  content: { paddingHorizontal: 22, paddingTop: 23 },
  error: { color: colors.danger, fontSize: 12, marginBottom: 12 },
  titleBlock: { gap: 5 },
  kicker: { color: '#9298A1', fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  name: { color: '#17191D', fontSize: 29, lineHeight: 35, fontWeight: '700', letterSpacing: -1.05 },
  priceAndStock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 },
  price: { color: '#17191D', fontSize: 21, fontWeight: '800', letterSpacing: -0.45 },
  availability: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#39A66B' },
  statusDotOut: { backgroundColor: colors.danger },
  stockText: { color: '#60826E', fontSize: 11, fontWeight: '600' },
  stockTextOut: { color: colors.danger },
  separator: { height: 1, backgroundColor: '#ECEDEF', marginTop: 22 },
  section: { paddingTop: 22, paddingBottom: 23 },
  sectionEyebrow: { color: '#9298A1', fontSize: 9, fontWeight: '800', letterSpacing: 1.45 },
  sectionTitle: { color: '#17191D', fontSize: 17, fontWeight: '700', marginTop: 8, letterSpacing: -0.35 },
  description: { color: '#6F7580', fontSize: 14, lineHeight: 22, marginTop: 8 },
  infoCard: { padding: 17, borderRadius: 18, backgroundColor: '#F7F8F9', borderWidth: 1, borderColor: '#EEF0F2' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13 },
  infoLabel: { color: '#858B95', fontSize: 12, fontWeight: '500' },
  infoValue: { color: '#252931', fontSize: 12, fontWeight: '700' },
  infoDivider: { height: 1, backgroundColor: '#E8EAED' },
  adminActions: { flexDirection: 'row', gap: 10, marginTop: 22, marginBottom: 12 },
  purchaseBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 17,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEDEF',
  },
  quantityControl: {
    height: 52,
    minWidth: 112,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E6E8EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  quantityButton: { width: 32, height: 42, alignItems: 'center', justifyContent: 'center' },
  quantityValue: { color: colors.ink, fontSize: 14, fontWeight: '700', minWidth: 17, textAlign: 'center' },
  addToBag: {
    flex: 1,
    minHeight: 52,
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: '#17191D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addToBagDisabled: { opacity: 0.38 },
  addToBagPressed: { transform: [{ scale: 0.985 }] },
  addToBagTextGroup: { gap: 2 },
  addToBagTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  addToBagPrice: { color: '#CED1D6', fontSize: 10, fontWeight: '600' },
})
