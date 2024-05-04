import { get } from 'lodash'

export const PORT = {
  ninji: 'Ninji',
  viction: 'Viction',
  fin: 'Fin'
}

export const PORT_NAME = get(PORT, `${process.env.PLASMO_PUBLIC_WALLET_NAME}`, 'Viction')

export const PORT_BACKGROUND = `${PORT_NAME}:BackgroundScript`
export const PORT_CONTENT = `${PORT_NAME}:ContentScript`
export const PORT_INPAGE = `${PORT_NAME}:Inpage`
export const PORT_EVENT = `${PORT_NAME}:EventScript`
