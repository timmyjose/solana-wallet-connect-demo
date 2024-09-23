import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import bs58 from 'bs58'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Pressable, Text, View } from 'react-native'
import { RootStackParamList } from '../App'
import { globalStyles } from '../config/styles.'
import * as Linking from 'expo-linking'
import { clusterApiUrl,  Connection, PublicKey, SystemProgram, Transaction} from '@solana/web3.js'
import nacl, { BoxKeyPair } from 'tweetnacl'
import { useContext, useEffect, useState } from 'react'
import { SolanaNetworkContext } from '../providers/SolanaNetworkContextProvider'
import { buildUrl, decryptPayload, encryptPayload } from './util'

const onConnectRedirectLink = Linking.createURL('Phantomwallet/onConnect')
const onDisconnectRedirectLink = Linking.createURL('onDisconnect')
const onShowBalanceRedirectLink = Linking.createURL('onShowBalance')
const onSignMessageRedirectLink = Linking.createURL('onSignMessage')

const PhantomWallet = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const [output, setOutput] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { network } = useContext(SolanaNetworkContext)
  const [deepLink, setDeepLink] = useState<string>('')
  const connection = new Connection(clusterApiUrl(network))
  
  // these should probably be persisted?
  const [dappKeyPair] = useState<BoxKeyPair>(nacl.box.keyPair())
  const [sharedSecret, setSharedSecret] = useState<Uint8Array>()
  const [session, setSession] = useState<string>()
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState<PublicKey>()

  // set the initial deep link
  useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL()
      console.log(`initialUrl = ${initialUrl}`)
      if (initialUrl) {
        setDeepLink(initialUrl)
      }
    })()

    const subscription = Linking.addEventListener('url', handleDeepLink)

    return () => {
      subscription.remove()
    }
  }, [])

  const handleDeepLink = ({ url } : Linking.EventType) => {
    console.log(`Setting deep link to ${url}`)
    setDeepLink(url)
  }
  
  // handle inbound links
  useEffect(() => {
    console.log('EINS')
    if (!deepLink) {
      return
    }
    console.log('ZWEI')

    const url = new URL(deepLink)
    const params = url.searchParams

    if (params.get('errorCode')) {
      setErrorMessage(JSON.stringify(Object.fromEntries([...params]), null, 2))
      return
    }

    if (/onConnect/.test(url.pathname || url.host)) {
      console.warn('Inside onConnect callback')
      const sharedSecretDapp = nacl.box.before(
        bs58.decode(params.get('phantom_encryption_public_key')!),
        dappKeyPair.secretKey
      )

      const connectData = decryptPayload(
        params.get('data')!,
        params.get('nonce')!,
        sharedSecretDapp
      )

      setSharedSecret(sharedSecretDapp)
      setSession(connectData.session)
      setPhantomWalletPublicKey(new PublicKey(connectData.public_key))

      setOutput(JSON.stringify(connectData, null, 2))
    } else if (/onDisconnect/.test(url.pathname || url.host)) {
      console.log('Inside onDisconnect callback')
      setOutput('Disconnected')
    }
  }, [deepLink])

  const handleConnect = async () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: network,
      app_url: 'https://phantom.app',
      redirect_link: onConnectRedirectLink
    })

    const url = buildUrl('connect', params)
    Linking.openURL(url)
  }

  const handleDisconnect = async () => {
    const payload = { 
      session
    }

    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret)

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onDisconnectRedirectLink,
      payload: bs58.encode(encryptedPayload)
    })

    const url = buildUrl('disconnect', params)
    Linking.openURL(url)
  }

  return (
    <View style={globalStyles.container}>
      { !!errorMessage && (<Text style={{
        marginLeft: 10,
        marginRight: 10
      }}>{errorMessage}</Text>) }
      { !!output && (<Text style={{ 
        marginLeft: 10,
        marginRight: 10
        }}>{output}</Text>) }
      <View style={{ flexDirection: 'row'}}>
        <Pressable
          style={globalStyles.smallButton}
          onPress={handleConnect}>
          <Text>Connect</Text>
        </Pressable>
        <Pressable
          style={globalStyles.smallButton}
          onPress={handleDisconnect}>
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

export default PhantomWallet
