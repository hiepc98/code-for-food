import { Alert, Button, Icon } from '@wallet/ui'

import { useCreateWalletContext } from '../../context/CreateWalletContext'
// import useClipboard from '../../../../hooks/useViewport'
import useClipboard from '../../../../hooks/useClipboard'
import { useTranslation } from 'react-i18next'

const StepPassphrase = () => {
  const { t } = useTranslation()
  const { state, onConfirmBackup} = useCreateWalletContext()
  const { onCopyWithTitle } = useClipboard({ t })
  const { generatedPhrase } = state

  return (
    <>
      <div className="my-3 text-ui04 text-base">
        {t('step_passphrase.write_down_or_copy_words')}
      </div>

      <ul className="columns-2 mb-1">
        {generatedPhrase.map((word, _index) => {
          const renderIndex = _index + 1
          return (
            <li
              key={word}
              className="bg-ui01 px-3 py-2 mb-2 text-tiny text-ui04 grid grid-cols-5">
              <span className="col-span-1 text-body-14-bold text-tx-secondary">{renderIndex}</span>
              <span className="col-span-4">{word}</span>
            </li>
          )
        })}
      </ul>

      <div className="w-full mb-3">
        <div
          className="mx-auto text-primary uppercase all-center self-center cursor-pointer"
          onClick={onCopyWithTitle(
            generatedPhrase.join(' '),
            t('step.passphrase')
          )}>
          <Icon name="copy" className="text-h5 mr-2" />
          {t('step_passphrase.copy_passphrase')}
        </div>
      </div>

      <div className="mt-auto">
        <Alert type="orange" className="mb-2 leading-4">
          {t('step_passphrase.never_share_passphrase')}
        </Alert>

        <Button isBlock onClick={onConfirmBackup}>
          {t('step_passphrase.continue')}
        </Button>
      </div>
    </>
  )
}

export default StepPassphrase
