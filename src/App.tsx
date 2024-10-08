import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from "./screens/Home"
import SolanaConnect  from "./screens/SolanaConnect"
import PhantomWallet from './wallets/PhantomWallet'
import SolflareWallet from './wallets/SolflareWallet'
import SolanaNetworkContextProvider from './providers/SolanaNetworkContextProvider'
import * as Linking from 'expo-linking'
import { Text } from 'react-native'

const prefix = Linking.createURL('/')

export type RootStackParamList = {
  Home: undefined
  SolanaConnect: undefined
  PhantomWallet: undefined
  SolflareWallet: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
  const linking = {
    prefixes: [prefix, 'swcd', 'swcd://'],
    config: {
      screens: {
        Home: {
          path: 'Home'
        },
        SolanaConnect: {
          path: 'SolanaConnect'
        },
        PhantomWallet: {
          path: 'PhantomWallet'
        },
        SolflareWallet: {
          path: 'SolflareWallet'
        }
      }
    }
  }

  return (
    <SolanaNetworkContextProvider>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Stack.Navigator>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='SolanaConnect' component={SolanaConnect} />
          <Stack.Screen name='PhantomWallet' component={PhantomWallet} />
          <Stack.Screen name='SolflareWallet' component={SolflareWallet} />
        </Stack.Navigator>
      </NavigationContainer>
    </SolanaNetworkContextProvider>
  )
}

export default App
