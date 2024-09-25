import * as Linking from 'expo-linking'
import SolanaWallet from '../components/SolanaWallet'

const PhantomWallet = () => {
  const onConnectRedirectLink = Linking.createURL('PhantomWallet/onConnect')
  const onDisconnectRedirectLink = Linking.createURL('PhantomWallet/onDisconnect')
  const onSignMessageRedirectLink = Linking.createURL('PhantomWallet/onSignMessage')
  const onSignTxnRedirectLink = Linking.createURL('PhantomWallet/onSignTxn')
  const appUrl = 'https://phantom.app'
  const urlPrefix = ''

  return (
    <SolanaWallet 
      walletKind='phantom' 
      onConnectRedirectLink={onConnectRedirectLink} 
      onDisconnectRedirectLink={onDisconnectRedirectLink} 
      onSignMessageRedirectLink={onSignMessageRedirectLink} 
      onSignTxnRedirectLink={onSignTxnRedirectLink}
      appUrl={appUrl} 
      urlPrefix={urlPrefix}  
      />
  )
}

export default PhantomWallet
