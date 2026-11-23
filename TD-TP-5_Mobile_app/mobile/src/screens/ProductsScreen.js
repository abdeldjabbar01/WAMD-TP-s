import { useCallback, useMemo, useState } from 'react'
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import ProductCard from '../components/ProductCard'
import { EmptyView, ErrorView, Loading } from '../components/StateViews'
import { productsApi, getErrorMessage } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { addToCart } from '../store/cartSlice'
import { colors } from '../theme'
import { toCartItem } from '../utils/cart'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Blue', value: 'blue' },
  { label: 'Summer', value: 'summer' },
  { label: 'Fresh', value: 'fresh' },
  { label: 'Floral', value: 'floral' },
  { label: 'Woody', value: 'woody' },
]

function matchesFilter(product, filter) {
  if (filter === 'all') return true

  const category = String(product.category || '').trim().toLowerCase()
  const searchable = [product.name, product.description, product.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  // Men/Women are existing product categories. Other chips match words
  // already present in the product's saved name, category, or description.
  const words = searchable.split(/[^a-z0-9]+/).filter(Boolean)
  if (filter === 'men' || filter === 'women') return category === filter || words.includes(filter)
  return words.includes(filter)
}

export default function ProductsScreen({ navigation, route }) {
  const dispatch = useDispatch()
  const { isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productsApi.list()
      setProducts(data)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(useCallback(() => { fetchProducts() }, [fetchProducts]))

  const term = String(route?.params?.globalSearch || '').trim().toLowerCase()
  const visible = useMemo(() => products.filter((product) => {
    const matchesSearch = !term || String(product.name || '').toLowerCase().includes(term)
    return matchesSearch && matchesFilter(product, selectedFilter)
  }), [products, term, selectedFilter])

  if (loading) return <Loading label="Loading perfumes…" />
  if (error && products.length === 0) {
    return <ErrorView message={error} onRetry={() => { setLoading(true); fetchProducts() }} />
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.banner}>{error}</Text> : null}

      <View style={styles.filterHeader}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((filter) => {
            const active = selectedFilter === filter.value
            return (
              <Pressable
                key={filter.value}
                onPress={() => setSelectedFilter(filter.value)}
                style={({ pressed }) => [
                  styles.filterChip,
                  active && styles.filterChipActive,
                  pressed && styles.filterPressed,
                ]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter.label}</Text>
              </Pressable>
            )
          })}
        </ScrollView>
        {isAdmin && (
          <Pressable onPress={() => navigation.navigate('ProductForm')} style={styles.addProduct}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item._id}
        numColumns={1}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProducts() }} />
        }
        ListEmptyComponent={
          <EmptyView
            title={term ? `No perfumes found for “${term}”` : 'No fragrances in this filter'}
            message="Try another filter or choose All."
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { productId: item._id, product: item })}
            onAdd={() => dispatch(addToCart(toCartItem(item)))}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  filterHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
  filters: { paddingHorizontal: 16, alignItems: 'center', gap: 8 },
  filterChip: {
    minHeight: 34,
    paddingHorizontal: 15,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E9EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterPressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  filterText: { color: '#626873', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  addProduct: {
    width: 34,
    height: 34,
    marginLeft: 8,
    marginRight: 15,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { paddingTop: 2, paddingBottom: 24, flexGrow: 1 },
  banner: { color: colors.danger, textAlign: 'center', paddingHorizontal: 12, fontSize: 13 },
})
