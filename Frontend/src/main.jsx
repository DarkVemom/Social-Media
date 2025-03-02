import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'

import './index.css'
import App from './App.jsx'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom'

import { SocketContextProvider } from './context/SocketContext.jsx'
// import { PostContextProvider } from './context/Postcontext.jsx'



const styles = {
	global: (props) => ({
		body: {
			color: mode("gray.800", "whiteAlpha.900")(props),
			bg: mode("gray.100", "#101010")(props),
		},
	}),
};

const config = {
	initialColorMode: "dark",
	useSystemColorMode: true,
};

const colors = {
	gray: {
		light: "#616161",
		dark: "#1e1e1e",
	},
};

const theme = extendTheme({ config, styles, colors });


createRoot(document.getElementById('root')).render(
	// <React.StrictMode> rendering every component twice , on dev mode
	<StrictMode>
			<BrowserRouter>
				<ChakraProvider theme={theme}>
					<ColorModeScript initialColorMode={theme.config.initialColorMode} />
					{/* <PostContextProvider> */}
					<SocketContextProvider>
					<App />
					</SocketContextProvider>
					{/* </PostContextProvider> */}
				</ChakraProvider>
			</BrowserRouter>
 </StrictMode>,
)

