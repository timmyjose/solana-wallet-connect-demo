import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Pressable, Text, View } from 'react-native'
import { RootStackParamList } from '../App'
import { globalStyles } from '../config/styles.'

const SolflareWallet = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <View style={globalStyles.container}>
      <View style={{ flexDirection: 'row'}}>
        <Pressable
          style={globalStyles.smallButton}
          onPress={() => {}}>
          <Text>Connect</Text>
        </Pressable>
        <Pressable
          style={globalStyles.smallButton}
          onPress={() => {}}>
          <Text>Disconnect</Text>
        </Pressable>
        <Pressable
          style={globalStyles.smallButton}
          onPress={() => {}}>
          <Text>Show Balance</Text>
        </Pressable>
        <Pressable
          style={globalStyles.smallButton}
          onPress={() => {}}>
          <Text>Sign Message</Text>
        </Pressable>
      </View>
      <Pressable
        style={globalStyles.button}
        onPress={() => navigation.navigate('Home')}>
          <Text>Home</Text>
      </Pressable>
    </View>
  )
}

export default SolflareWallet
