import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { globalStyles } from '../config/styles.'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import SolanaNetworkPicker  from '../components/SolanaNetworkPicker'

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <View style={globalStyles.container}>
      <SolanaNetworkPicker />
      <Pressable
        style={globalStyles.button}
      onPress={() => navigation.navigate('SolanaConnect')}>
          <Text>Solana Wallet Connect</Text>
        </Pressable>
    </View>
  )
}

export default Home