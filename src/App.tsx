import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "./screens/Home"
import SolanaConnect from "./screens/SolanaConnect"

export type RootStackParamList = {
  Home: undefined
  SolanaConnect: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='SolanaConnect' component={SolanaConnect} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
