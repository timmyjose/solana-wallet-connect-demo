import { createContext, useState } from 'react'

export type SolanaNetWorkKind = 'devnet' | 'testnet' | 'mainnet-beta'

export type SolanaNetwork = {
  network: SolanaNetWorkKind
  setNetwork: (network: SolanaNetWorkKind) => void
}

const defaultSolanaNetwork: SolanaNetwork = {
  network: 'devnet',
  setNetwork: (network: SolanaNetWorkKind) => {}
}

export const SolanaNetworkContext = createContext<SolanaNetwork>(defaultSolanaNetwork)

const SolanaNetworkContextProvider = ({ children }: { children: React.ReactNode}) => {
  const [network, setNetwork] = useState<SolanaNetWorkKind>(defaultSolanaNetwork.network)

  return (
    <SolanaNetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </SolanaNetworkContext.Provider>
  )
}

export default SolanaNetworkContextProvider
