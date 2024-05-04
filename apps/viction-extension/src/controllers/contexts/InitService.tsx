import { lazy } from '@loadable/component'
import { BaseWallet } from '@wallet/base'
import type { EngineConfiguration } from '@wallet/core'
import React, { FC, useEffect, useMemo, useRef } from 'react'

import { useAppSelector } from 'store'

interface Props {
  isReady: boolean
  info: EngineConfiguration
  initialize: (lib: BaseWallet, integration: any) => any
}

const loadableServices = [
  {
    name: 'EvmService',
    engine: 'EvmEngine',
    integrationEngine: 'EvmIntegrationHandle',
    type: 'evm',
    component: lazy.lib(() => import('@wallet/evm'))
  }
  // {
  //   name: 'CosmosService',
  //   engine: 'CosmosEngine',
  //   type: 'cosmos',
  //   component: lazy.lib(() => import('@wallet/cosmos'))
  // },
  // {
  //   name: 'SolanaService',
  //   engine: 'SolanaEngine',
  //   type: 'solana',
  //   component: lazy.lib(() => import('@wallet/solana'))
  // }
  // {
  //   name: 'ConfluxService',
  //   engine: 'ConfluxEngine',
  //   type: 'conflux',
  //   component: lazy.lib(() => import('@wallet/conflux'))
  // },
  // {
  //   name: 'TronService',
  //   engine: 'TronEngine',
  //   type: 'tron',
  //   component: lazy.lib(() => import('@wallet/tron'))
  // },
  // {
  //   name: 'TezosService',
  //   engine: 'TezosEngine',
  //   type: 'tezos',
  //   component: lazy.lib(() => import('@wallet/tezos'))
  // },
  // {
  //   name: 'NearService',
  //   engine: 'NearEngine',
  //   type: 'near',
  //   component: lazy.lib(() => import('@wallet/near'))
  // },
  // {
  //   name: 'ThetaService',
  //   engine: 'ThetaEngine',
  //   type: 'theta',
  //   component: lazy.lib(() => import('@wallet/theta'))
  // },
  // {
  //   name: 'TonService',
  //   engine: 'TonEngine',
  //   type: 'ton',
  //   component: lazy.lib(() => import('@wallet/ton'))
  // },
  // {
  //   name: 'AvaxService',
  //   engine: 'AvaxEngine',
  //   type: 'avax',
  //   component: lazy.lib(() => import('@wallet/avax'))
  // },

  // {
  //   name: 'AlgoService',
  //   engine: 'AlgoEngine',
  //   type: 'algorand',
  //   component: lazy.lib(() => import('@wallet/algorand'))
  // },
  // {
  //   name: 'PolkadotService',
  //   engine: 'PolkadotEngine',
  //   type: 'polkadot',
  //   component: lazy.lib(() => import('@wallet/polkadot'))
  // },
  // {
  //   name: 'ThorService',
  //   engine: 'ThorEngine',
  //   type: 'thor',
  //   component: lazy.lib(() => import('@wallet/thor'))
  // }
  // {
  //   name: 'TerraService',
  //   engine: 'TerraEngine',
  //   type: 'terra',
  //   component: lazy.lib(() => import('@wallet/terra'))
  // }
]

const InitService: FC<Props> = ({ isReady, info, initialize }) => {
  const isInitialized = useRef<boolean>(false)
  const engines = useRef<any[]>([])
  const timer = useRef<any>(null)

  const [activeNetwork] = useAppSelector((state) => [
    state.setting.activeNetwork
  ])

  const init = async () => {
    if (!isReady || engines.current.length !== loadableServices.length) {
      timer.current = setTimeout(() => {
        init()
      }, 200)
      return
    }

    if (!isInitialized.current) {
      const baseWallet = new BaseWallet(
        info,
        engines.current.map(({ engine }) => engine)
      )
      const integrationEngine = engines.current.map(({ integrationEngine: IntegrationEngine }) => new IntegrationEngine(activeNetwork))

      initialize(baseWallet, integrationEngine[0])
      isInitialized.current = true
    }
  }

  useEffect(() => {
    if (isReady) init()

    return () => {
      clearTimeout(timer.current)
    }
  }, [isReady])

  const countableRenderingServices = useMemo(() => {
    return loadableServices.map(({ name, engine, integrationEngine, component: Component }) => (
      <Component key={name}>
        {/* @ts-ignore */}
        {(lib: any) => {
          if (!engines.current.find((it) => it.name === name)) {
            engines.current.push({
              name,
              engine: lib[engine],
              integrationEngine: lib[integrationEngine]
            })
          }
          return null
        }}
      </Component>
    ))
  }, [])

  return <>{countableRenderingServices}</>
}

export default React.memo(InitService)
