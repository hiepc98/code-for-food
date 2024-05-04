import withI18nProvider from '../../../provider'
import { SORT_TYPE } from '../../../types'
import { cx } from '../../../utils'
import { useTranslation } from 'react-i18next'
import { Icon, ListItem } from '@wallet/ui'

interface IProps {
  currentSort: SORT_TYPE
  handleSort: (type: SORT_TYPE) => void
}

const ValidatorSort = (props: IProps) => {
  const { t } = useTranslation()
  const { currentSort, handleSort } = props

  const SortType = [
    {
      label: t('stake_screen.validator_sort_alphabet'),
      value: SORT_TYPE.ALPHABET
    },
    {
      label: t('stake_screen.validator_sort_amount'),
      value: SORT_TYPE.AMOUNT_STAKED
    }
  ]

  const handleSortAndClose = (type: SORT_TYPE) => {
    handleSort(type)
    window.closeModal()
  }

  return (
    <div className="w-full h-full py-5 mt-20 relative flex flex-col overflow-scroll">
      <div className="flex w-full h-full flex-col">
        {SortType.map((item, index) => (
          <ListItem
            title={item.label}
            onClick={() => handleSortAndClose(item.value)}
            hideImage
            className='px-5 w-full justify-between'
            rightView={
              currentSort === item.value && (
                <div className="w-auto text-h2">
                <Icon
                  name="check"
                  className={cx(
                    'text-icon-primary',
                  )}
                />
              </div>
              )
            }
          />
        ))}
      </div>
    </div>
  )
}

export default withI18nProvider(ValidatorSort)
