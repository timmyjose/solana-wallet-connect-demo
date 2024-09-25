import * as Linking from 'expo-linking'
import SolanaWallet from '../components/SolanaWallet'

const SolflareWallet = () => {
  const onConnectRedirectLink = Linking.createURL('SolflareWallet/onConnect')
  const onDisconnectRedirectLink = Linking.createURL('SolflareWallet/onDisconnect')
  const onSignMessageRedirectLink = Linking.createURL('SolflareWallet/onSignMessage')
  const onSignTxnRedirectLink = Linking.createURL('SolflareWallet/onSignTxn')
  const appUrl =  'https://solflare.com'
  const urlPrefix =  'v1/'

  return (
    <SolanaWallet 
      walletKind='solflare' 
      onConnectRedirectLink={onConnectRedirectLink} 
      onDisconnectRedirectLink={onDisconnectRedirectLink} 
      onSignMessageRedirectLink={onSignMessageRedirectLink} 
      onSignTxnRedirectLink={onSignTxnRedirectLink}
      appUrl={appUrl} 
      urlPrefix={urlPrefix}
    />
  )
}

export default SolflareWallet
