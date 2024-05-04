import withI18nProvider from '../../../../provider'
import React, { type FC } from 'react'
import { useTranslation } from 'react-i18next'
// import { useIntegrationContext } from '../../context'
import { useLocation } from 'react-router-dom'

// import { isValidAddress, truncate } from '@wallet/utils'
// Currently testing on evm only
const SignatureRequestScreen: FC = () => {
  const { state } = useLocation<any>()
  const { t } = useTranslation()

  // const { request } = useIntegrationContext()

  // const { favIconUrl, title } = request.sender?.tab || {}
  // const { origin } = request.sender || {}

  // const nestedRender = (data: object) => {
  //   return Object.keys(data).map(key => {
  //     const name = key
  //     const value = data[key]
  //     const isAddress = isValidAddress(value)
  //     const isObject = typeof value === 'object'
  //     const renderValue = () => {
  //       if (isAddress) {
  //         return <a>{truncate(value)}</a>
  //       }
  //       return value
  //     }
  //     return <div key={key}>
  //         <div className="capitalize text-yellow">{name}</div>
  //         <div className="pl-2">
  //             {isObject ? nestedRender(value) : renderValue()}
  //         </div>
  //     </div>
  //   })
  // }

  // const message = useMemo(() => {
  //   const { messages } = state?.renderRequest.data

  //   if (typeof messages === 'object') {
  //     if (Array.isArray(messages)) {
  //       return (
  //         <>
  //           {messages.map(msg => {
  //             const name = msg.name
  //             const value = msg.value
  //             const isAddress = isValidAddress(value)

  //             return (
  //               <div key={JSON.stringify(msg)}>
  //                 <div className="capitalize text-yellow">{name}</div>
  //                 <div className="pl-2">
  //                   {isAddress ? truncate(value) : value}
  //                 </div>
  //             </div>
  //             )
  //           })}
  //           </>
  //       )
  //     }

  //     if (messages.message) {
  //       // TypedData
  //       const renderData = messages.message
  //       return (
  //         <div>
  //           <div>
  //             Type: {messages.primaryType}
  //           </div>
  //           {nestedRender(renderData)}
  //         </div>
  //       )
  //     }
  //   }

  //   return JSON.stringify(messages, null, 2)
  // }, [state.renderRequest])

  const favIconUrl = ''
  const title = ''
  const message = ''

  return (
    <div className="flex h-full flex-col justify-around items-center">
      <div className="text-white/50 flex justify-between gap-x-2 items-center bg-white/6 rounded-2xl p-2">
        <img
          src={favIconUrl}
          className="w-6 h-6 rounded-full flex justify-center items-center"
        />
        <p>{origin}</p>
      </div>
      <div className="text-center">
        {/* <span className="text-yellow bg-dark p-0.5 px-1 rounded">{host}</span> */}
        <p className="font-medium text-lg my-3">
          {t('signature_request.signature_request')}
        </p>
        <p className="text-white/50 text-xs px-10">
          {t('signature_request.signature_request', {
            host: title
          })}
        </p>
      </div>
      <div className="px-10 w-full overflow-y-scroll h-80">
        <div className="bg-white/6 px-5 rounded-2xl w-full text-xs">
          <pre className="font-normal py-4 overflow-auto whitespace-pre-wrap break-words max-h-[300px] w-full">
            {message}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default withI18nProvider(SignatureRequestScreen)
