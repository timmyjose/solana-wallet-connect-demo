import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { globalStyles } from '../config/styles.'

const SolanaConnect = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <View style={globalStyles.container}>
      <Pressable
        style={globalStyles.button}
        onPress={() => navigation.navigate('Home')}>
          <Text>Home</Text>
        </Pressable>
    </View>
  )
}

export default SolanaConnect
