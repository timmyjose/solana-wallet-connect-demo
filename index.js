import { registerRootComponent } from 'expo'
import App from './src/App'
import { Buffer } from 'buffer'

global.Buffer = global.Buffer || Buffer

registerRootComponent(App)

