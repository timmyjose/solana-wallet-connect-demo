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
import { Buffer } from 'buffer'

const onConnectRedirectLink = Linking.createURL('PhantomWallet/onConnect')
const onDisconnectRedirectLink = Linking.createURL('PhantomWallet/onDisconnect')
const onSignMessageRedirectLink = Linking.createURL('PhantomWallet/onSignMessage')

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
    setDeepLink(url)
  }
  
  // handle inbound links
  useEffect(() => {
    if (!deepLink) {
      return
    }

    const url = new URL(deepLink)
    const params = url.searchParams

    if (params.get('errorCode')) {
      setErrorMessage(JSON.stringify(Object.fromEntries([...params]), null, 2))
      return
    }

    if (/onConnect/.test(url.pathname || url.host)) {
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
      setOutput('Disconnected')
    } else if (/onSignMessage/.test(url.pathname || url.host)) {
      const signMessageData = decryptPayload(
        params.get('data')!,
        params.get('nonce')!,
        sharedSecret
      )
      setOutput(JSON.stringify(signMessageData, null, 2))
    }
  }, [deepLink])

  const handleConnect = async () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: network,
      app_url: 'https://phantom.app',
      redirect_link: onConnectRedirectLink
    })

    const url = buildUrl('phantom', 'connect', params)
    Linking.openURL(url)
  }

  const handleShowBalance = async () => {
    try {
      const balance = parseInt(await connection.getBalance(phantomWalletPublicKey)) / 1e9
      setOutput(`Balance = ${balance} SOL`)
    } catch (err: any) {
      setErrorMessage(err.toString())
    }
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

    const url = buildUrl('phantom', 'disconnect', params)
    Linking.openURL(url)
  }

  const handleSignMessage = async () => {
    const message = 'the quick brown fox jumps over the lazy dog'

    const payload = {
      session,
      message: bs58.encode(Buffer.from(message))
    }
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret)

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onSignMessageRedirectLink,
      payload: bs58.encode(encryptedPayload)
    })

    const url = buildUrl('phantom', 'signMessage', params)
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
          onPress={handleShowBalance}>
          <Text>Show Balance</Text>
        </Pressable>
        <Pressable
          style={globalStyles.smallButton}
          onPress={handleDisconnect}>
          <Text>Disconnect</Text>
        </Pressable>
        <Pressable
          style={globalStyles.smallButton}
          onPress={handleSignMessage}>
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
