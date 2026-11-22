import { useEffect, useState } from 'react'
import { I18nManager, View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Provider, useSelector } from 'react-redux'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import { store, initCartPersistence } from './src/store/store'
import { Loading } from './src/components/StateViews'
import ProductsScreen from './src/screens/ProductsScreen'
import ProductDetailsScreen from './src/screens/ProductDetailsScreen'
import CartScreen from './src/screens/CartScreen'
import AccountScreen from './src/screens/AccountScreen'
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import ProductFormScreen from './src/screens/ProductFormScreen'
import OrdersScreen from './src/screens/OrdersScreen'
import CustomersScreen from './src/screens/CustomersScreen'
import { colors } from './src/theme'
I18nManager.allowRTL(false)
I18nManager.forceRTL(false)
const Stack = createNativeStackNavigator(); const Tab = createBottomTabNavigator()
function BrandLogo() {
  return (
    <View style={s.brandLogo}>
      <Text style={s.brandP}>P</Text>
    </View>
  )
}

function HeaderSearch({ navigation }) {
  const [query, setQuery] = useState('')

  const submit = () => {
    navigation.navigate('Products', { globalSearch: query.trim() })
  }

  return (
    <View style={s.search}>
      <Ionicons name="search" size={16} color="#9297A1" />
      <TextInput
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={submit}
        placeholder="Search fragrances"
        placeholderTextColor="#9A9DA5"
        style={s.searchInput}
        returnKeyType="search"
        autoCorrect={false}
        underlineColorAndroid="transparent"
      />
      {query.length > 0 && (
        <Pressable onPress={() => setQuery('')} hitSlop={8}>
          <Ionicons name="close-circle" size={15} color="#A1A5AD" />
        </Pressable>
      )}
    </View>
  )
}

function HeaderCart({ navigation }) {
  const { isAdmin } = useAuth()
  const count = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0))

  return (
    <Pressable
      onPress={() => navigation.navigate(isAdmin ? 'Orders' : 'Cart')}
      style={({ pressed }) => [s.cartButton, pressed && { opacity: 0.65, transform: [{ scale: 0.94 }] }]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={isAdmin ? 'Open orders' : `Open cart, ${count} items`}
    >
      <Ionicons name="bag-handle-outline" size={22} color={colors.ink} />
      {!isAdmin && count > 0 && (
        <View style={s.cartBadge}>
          <Text style={s.cartBadgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </Pressable>
  )
}

function Tabs() {
  const { isAdmin } = useAuth()
  const count = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0))
  const screens = isAdmin
    ? [['Products', ProductsScreen, 'grid-outline'], ['Orders', OrdersScreen, 'receipt-outline'], ['Customers', CustomersScreen, 'people-outline'], ['Account', AccountScreen, 'person-outline']]
    : [['Products', ProductsScreen, 'home-outline'], ['Cart', CartScreen, 'bag-outline'], ['Account', AccountScreen, 'person-outline']]

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
        headerTitle: () => <HeaderSearch navigation={navigation} />,
        headerLeft: () => <BrandLogo />,
        headerRight: () => <HeaderCart navigation={navigation} />,
        headerTitleAlign: 'center',
        headerTitleContainerStyle: { flex: 1, alignItems: 'center', marginHorizontal: 0, position: 'center',},
        headerLeftContainerStyle: { paddingLeft: 12 },
        headerRightContainerStyle: { paddingRight: 12 },
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: '#9297A1',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 5 },
        tabBarStyle: { height: 78, paddingTop: 10, paddingBottom: 10, borderTopColor: '#ECEDEF', backgroundColor: '#FFFFFF' },
        tabBarIcon: ({ color, focused }) => (
          <View style={[s.tabIcon, focused && s.tabIconActive]}>
            <Ionicons name={screens.find((item) => item[0] === route.name)?.[2] || 'ellipse'} size={20} color={color} />
          </View>
        ),
        tabBarBadge: route.name === 'Cart' && count > 0 ? count : undefined,
      })}
    >
      {screens.map(([name, component]) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{ title: name === 'Products' ? 'Discover' : name }}
        />
      ))}
    </Tab.Navigator>
  )
}

function Root(){const {restoring}=useAuth();const [ready,setReady]=useState(false);useEffect(()=>{initCartPersistence().finally(()=>setReady(true))},[]);if(restoring||!ready)return <View style={{flex:1}}><Loading/></View>;return <NavigationContainer><Stack.Navigator screenOptions={{headerStyle:{backgroundColor:colors.white},headerTintColor:colors.ink,headerShadowVisible:false,headerTitleStyle:{fontWeight:'700'}}}><Stack.Screen name="Tabs" component={Tabs} options={{headerShown:false}}/><Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{title:'Fragrance'}}/><Stack.Screen name="Login" component={LoginScreen} options={{title:'Sign in'}}/><Stack.Screen name="Register" component={RegisterScreen} options={{title:'Create account'}}/><Stack.Screen name="ProductForm" component={ProductFormScreen} options={{title:'Product editor'}}/></Stack.Navigator></NavigationContainer>}
export default function App(){return <SafeAreaProvider><Provider store={store}><AuthProvider><StatusBar style="dark"/><Root/></AuthProvider></Provider></SafeAreaProvider>}
const s = StyleSheet.create({
  brandLogo: {
    width: 32,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#17191D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandP: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', letterSpacing: -1.6, lineHeight: 28 },
  search: {
    width: '220%',
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 7,
  },
  searchInput: { flex: 1, minWidth: 0, fontSize: 12, color: '#17191D', paddingVertical: 0 },
  cartButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: -1,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 9,
    backgroundColor: '#17191D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  tabIcon: { width: 34, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  tabIconActive: { backgroundColor: '#EAF2FF' },
})
