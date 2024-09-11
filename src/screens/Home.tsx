import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { globalStyles } from '../config/styles.'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <View style={globalStyles.container}>
      <Pressable
        style={globalStyles.button}
        onPress={() => navigation.navigate('SolanaConnect')}>
          <Text>Solana Connect</Text>
        </Pressable>
    </View>
  )
}

export default Home