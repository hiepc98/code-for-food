import React, { useState, useEffect } from 'react'
import { Input, ListItemWithFooter } from '@wallet/ui'
import type { IListItem } from '../../../types'
import withI18nProvider from '../../../provider'
import { useTranslation } from 'react-i18next'
import { useStakingContext } from '../context'
import get from 'lodash/get'
import Loader from '../../shared/Loader'
import { formatNumberBro } from '../../../utils'
import { STAKE_STEP } from '../../../types'
import useRouting from '../../../hooks/useRouting'
import { truncate } from '@wallet/utils'
import round from 'lodash/round'

const ValidatorSelectionScreen = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [filterValidatorList, setFilterValidatorList] = useState<any>([])

  const {
    isLoading,
    setIsLoading,
    validatorList,
    setSelectedValidator,
    setCurrentStep
  } = useStakingContext()

  const { navigateScreen } = useRouting()

  useEffect(() => {
    setFilterValidatorList(validatorList)
  }, [validatorList])

  const onChangeSearch = (event: any) => {
    setSearch(event.target.value)

    const filtered = validatorList.filter((it: any) => {
      const nameLowerCase = get(it, 'name', '').toLowerCase()
      const targetLowerCase = event.target.value.toLowerCase()
      return nameLowerCase.includes(targetLowerCase)
    })
    setFilterValidatorList(filtered)
  }

  const handleControl = (item: IListItem) => () => {
    setSelectedValidator?.(item)
    setCurrentStep?.(STAKE_STEP.Review)
    navigateScreen('/staking', {
      fromScreen: 'validator-select',
      isFullScreen: true
    })()
  }

  const renderValidatorList = () => {
    if (!filterValidatorList) {
      return (
        <div className="flex h-full w-full all-center">
          <p className="h text-tx-primary">{t('stake_screen.no_validator')}</p>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex h-full w-full all-center">
          <Loader width="200px" height="200px" />
        </div>
      )
    }

    return filterValidatorList.map((it: any) => {
      const status = get(it, 'status', 'SLASHED')
      if (status === 'SLASHED') {
        return null
      }
      const stakedTotal = get(it, 'capacityNumber', 0)
      const latestSignedBlock = get(it, 'latestSignedBlock', 0)
      const address = truncate(get(it, 'nodeId', ''))
      return (
        <ListItemWithFooter
          key={it.candidate}
          title={get(it, 'name', 'Validator Name')}
          description={
            <p className="text-brand-highlight body-12-bold">
              {t('stake_screen.rank', {
                // apr: it.commission.commission_rates.rate
                rank: get(it, 'rank', 0)
              }) +
                ' | ' +
                t('stake_screen.address', {
                  // apr: it.commission.commission_rates.rate
                  address: address
                })}
            </p>
          }
          onClick={handleControl(it)}
          showArrow={true}
          showBorder={false}
          className="py-2 pb-1 w-full"
          rootClassName="p-0"
          iconClassName="text-icon-primary"
          hideImage
          icon="validator">
          <div
            className="flex w-full flex-row gap-2 justify-between py-1 pb-2 px-5"
            onClick={handleControl(it)}>
            <div className="flex flex-col ">
              <p className="body-12-regular text-tx-secondary">
                {t('stake_screen.status')}
              </p>
              <p className="body-12-regular text-tx-primary">{status}</p>
            </div>
            <div className="flex flex-col">
              <p className="body-12-regular text-tx-secondary self-end">
                {t('stake_screen.staked')}
              </p>
              <p className="body-12-regular text-tx-primary">
                {formatNumberBro(round(Number(stakedTotal), 2)) + ' VIC'}
              </p>
            </div>
          </div>
        </ListItemWithFooter>
      )
    })
  }

  return (
    <div className="flex h-full w-full flex-col overflow-auto pb-2">
      <div className="gap-2 sticky px-5">
        <Input
          value={search}
          placeholder={t('Search')}
          className="body-14-regular text-base rounded-sm bg-field-bg-default"
          left={{ icon: 'search', className: 'icon-small font-semibold' }}
          onChange={onChangeSearch}
        />
        <p className="body-14-regular text-tx-secondary">
          {t('stake_screen.select_description')}
        </p>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex-1">{renderValidatorList()}</div>
      </div>
    </div>
  )
}

export default withI18nProvider(ValidatorSelectionScreen)
