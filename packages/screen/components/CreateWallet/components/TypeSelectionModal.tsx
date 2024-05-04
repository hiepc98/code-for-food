import { Row } from '@wallet/ui'
import withI18nProvider from '../../../provider'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const TypeSelectionModal = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const onRouting = (type: 'create' | 'restore') => () => {
    window.closeModal()

    return history.push(`/main/wallet/create/${type}`)
  }

  return (
    <div className="text-ui04 h-full pt-20 w-full relative bg-bg-brand">
      <div className="relative z-10 px-5">
        <Row
          title={t('type_selection_modal.create_a_new_wallet')}
          content={t('type_selection_modal.with_your_own_new_passphrase')}
          icon="edit"
          onClick={onRouting('create')}
        />
        <div className="text-h5 text-tx-secondary">Import wallet</div>
        {/* <div className="mx-5 border-b-[1px] border-ui02"></div> */}
        <Row
          title={t('type_selection_modal.restore_a_wallet')}
          content={t('type_selection_modal.by_your_existing_passphrase')}
          icon="history"
          onClick={onRouting('restore')}
        />
      </div>
      {/* <img
        src="/public/get_started.svg"
        alt=""
        className="w-full h-[250px] object-cover object-top absolute bottom-0 left-0 right-0 z-0"
      /> */}
    </div>
  )
}

export default withI18nProvider(TypeSelectionModal)
