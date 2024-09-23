import { StyleSheet, Text } from "react-native"
import { useContext, useState } from "react"
import DropDownPicker from 'react-native-dropdown-picker'
import { SolanaNetworkContext, SolanaNetWorkKind } from "../providers/SolanaNetworkContextProvider"

export type SolanaNetwork = {
  label: string,
  value: SolanaNetWorkKind
}

const SolanaNetworkPicker = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string | null>(null)
  const [items, setItems] = useState<SolanaNetwork[]>([
    {
      label: 'devnet',
      value: 'devnet'
    },
    {
      label: 'testnet',
      value: 'testnet'
    },
    {
      label: 'mainnet',
      value: 'mainnet-beta'
    }
  ])

  const handleOnClose = async () => {
    setNetwork(value as SolanaNetWorkKind)
  }

  const { setNetwork} = useContext(SolanaNetworkContext)

  return (
    <>
      <Text style={styles.text}>Choose the Solana Network</Text>
      <DropDownPicker
        style={styles.picker}
        placeholder='Select a network'
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={handleOnClose}
      />
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10
  },
  picker: {
    width: '40%',
    alignSelf: 'center',
    marginBottom: 30
  }
})

export default SolanaNetworkPicker
