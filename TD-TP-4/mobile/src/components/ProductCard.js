import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme'
import { formatPrice } from '../utils/format'
import { getImageSource } from '../utils/images'

export default function ProductCard({ product, onPress, onAdd }) {
  const outOfStock = Number(product.stock) <= 0

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`View ${product.name}`}
    >
      <View style={styles.imageFrame}>
        <Image
          source={getImageSource(product.imageUrl)}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category || 'FRAGRANCE'}
        </Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={[styles.stock, outOfStock && styles.outOfStock]}>
              {outOfStock ? 'Out of stock' : 'Available'}
            </Text>
          </View>
          <Pressable
            onPress={(event) => {
              event.stopPropagation()
              onAdd?.()
            }}
            disabled={outOfStock}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name} to cart`}
            style={({ pressed }) => [
              styles.addButton,
              outOfStock && styles.addDisabled,
              pressed && !outOfStock && styles.addPressed,
            ]}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 106,
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 8,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#ECEDEF',
    gap: 12,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.994 }] },
  imageFrame: {
    width: 82,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '88%', height: '100%' },
  body: { flex: 1, minWidth: 0, justifyContent: 'center', paddingVertical: 2 },
  category: {
    color: '#8B9099',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.25,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  name: { color: colors.ink, fontSize: 15, lineHeight: 19, fontWeight: '700', letterSpacing: -0.25 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 },
  priceBlock: { gap: 2 },
  price: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  stock: { color: colors.success, fontSize: 10, fontWeight: '600' },
  outOfStock: { color: colors.danger },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addDisabled: { opacity: 0.3 },
  addPressed: { transform: [{ scale: 0.92 }] },
})
