import { Button, Checkbox, Icon } from '@wallet/ui'
import { cx } from '@wallet/utils'

import { useCreateWalletContext } from '../../context/CreateWalletContext'
import useViewport from '../../../../hooks/useViewport'
import { useTranslation } from 'react-i18next'

const StepInform = () => {
  const { t } = useTranslation()
  const { state, onChangeReady, onConfirmReady } = useCreateWalletContext()
  const { isConfirmReady } = state

  const { isExpand } = useViewport()

  return (
    <>
      {isExpand && (
        <div className="my-10 text-ui04 font-body-16-regular">
          {t('step_inform.find_private_place')}
        </div>
      )}
      <div
        className={cx('overflow-auto h-full', {
          'mt-10': !isExpand
        })}>
        <div className="flex items-start mb-6">
          <div>
            <div className="w-[40px] h-[40px] text-white bg-primary mr-3 all-center text-[24px]">
              <Icon name="edit" className="text-ui00" />
            </div>
          </div>
          <div>
            <div className="font-medium mb-1 text-base text-ui04">
              {t('step_inform.12_secret_words')}
            </div>
            <div className="text-ui03">
              {t('step_inform.passphrase_list_of_12_secret_words')}
            </div>
          </div>
        </div>

        <div className="flex items-start mb-6">
          <div>
            <div className="w-[40px] h-[40px] text-white bg-primary mr-3 all-center text-[24px]">
              <Icon name="status_restricted" className="text-ui00" />
            </div>
          </div>
          <div>
            <div className="font-medium mb-1 text-base text-ui04">
              {t('step_inform.unrestorable')}
            </div>
            <div className="text-ui03">
              {t('step_inform.if_lose_passphrase')}
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <div>
            <div className="w-[40px] h-[40px] text-white bg-primary mr-3 all-center text-[24px]">
              <Icon name="lock_on" className="text-ui00" />
            </div>
          </div>
          <div>
            <div className="font-medium mb-1 text-base text-ui04">
              {t('step_inform.only_chance')}
            </div>
            <div className="text-ui03">
              {t('step_inform.passphrase_only_chance_to_recover')}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-center mb-6">
          <Checkbox checked={isConfirmReady} onChangeValue={onChangeReady}>
            <div className="ml-3 text-ui04">
              {t('step_inform.understand_if_lose_passphrase')}
            </div>
          </Checkbox>
        </div>
        <Button isBlock disabled={!isConfirmReady} onClick={onConfirmReady}>
          {t('step_inform.ready')}
        </Button>
      </div>
    </>
  )
}

export default StepInform
