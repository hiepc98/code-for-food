import { MainLayout } from '@wallet/ui'
import { cx } from '@wallet/utils'
// eslint-disable-next-line no-use-before-define
import React, { type FC, type HTMLAttributes } from 'react'

import TypeSelectionModal from '../../components/TypeSelectionModal'
import { useCreateWalletContext } from '../../context/CreateWalletContext'
import { WalletParams, WalletType } from '../../../../types'
import { useHistory, useParams } from 'react-router-dom'
import { useAppSelector } from 'store'
import { useTranslation } from 'react-i18next'
import { getLength } from '@wallet/utils'

interface WizardProps extends HTMLAttributes<HTMLDivElement> {}

const Wizard: FC<WizardProps> = ({ children, ...props }) => {
  const totalSlice = React.Children.count(children)
  const { state, goBack } = useCreateWalletContext()
  const { t } = useTranslation()

  const { type } = useParams<WalletParams>()

  const wallets = useAppSelector(state => state.wallet.wallets)

  const { currentStep } = state
  const history = useHistory()

  const renderIndicator = () => {
    return (
      <ul className="list-none p-0 m-0 flex gap-2 mx-auto justify-center items-center">
        {Array(totalSlice)
          .fill(1)
          .map((_it, index) => {
            const isActive = currentStep >= index
            return (
              <li
                key={index}
                className={cx(
                  'w-6 h-1 bg-ui02',
                  isActive && 'bg-primary'
                )}></li>
            )
          })}
      </ul>
    )
  }

  const renderWizardContent = () => {
    return React.Children.map(children, (child, index) => {
      const isActive = index === currentStep
      if (!isActive) return null
      // @ts-expect-error
      return React.cloneElement(child, { ...child.props })
    })
  }

  const renderTitle = () => {
    if (type === WalletType.Restore) {
      switch (currentStep) {
        case 0:
          return t('wizard.restore_wallet')
        default:
          return t('change_profile_screen.name_wallet')
      }
    }

    switch (currentStep) {
      case 0:
        return 'Import wallet'
      case 1:
        return t('change_profile_screen.backup_passphrase')
      case 2:
        return t('change_profile_screen.verify_passphrase')
      default:
        return t('change_profile_screen.name_wallet')
    }
  }

  const onRemoveCreateWallet = () => {
    window.openModal({
      okText: t('setting_screen.confirm'),
      title: t('change_profile_screen.are_you_sure'),
      content: t('main_screen.closing_this_step'),
      type: 'confirm',
      btnType: 'confirm',
      displayType: 'compact',
      iconType: 'danger',
      closable: false,
      onOk: () => {
        window.closeModal()
        setTimeout(() => {
          if (wallets.length > 0) {
            window.openModal({
              type: 'none',
              title: t('wizard.add_wallet'),
              content: <TypeSelectionModal t={t}/>,
              contentType: 'other',
              closable: true
            })
            setTimeout(() => {
              history.push('/main/wallet')
            }, 200)
          } else {
            history.goBack?.()
          }
        }, 200)
      }
    })
  }

  const onSelectTypeModal = () => {
    window.openModal({
      type: 'none',
      title: t('wizard.add_wallet'),
      content: <TypeSelectionModal t={t} />,
      contentType: 'other',
      closable: true
    })
  }

  const backAction = () => {
    const checkGoback =
      (type === WalletType.Restore && currentStep === 1) ||
      (type !== WalletType.Restore && currentStep === 3)
    switch (checkGoback) {
      case true:
        onRemoveCreateWallet()
        break

      default:
        if (currentStep === 0 && getLength(wallets)) {
          onSelectTypeModal()
          // Waiting show Popup before switch URL
          setTimeout(() => {
            goBack?.()
          }, 600)
          break
        }
        goBack?.()
        break
    }
  }

  return (
    <MainLayout
      title={t(renderTitle())}
      className="px-5 pb-5"
      backAction={backAction}
      currentStep={currentStep}
      headerClass="pb-3"
      walletType={type}>
      <div className="wizard" {...props}>
        {renderIndicator()}
        {renderWizardContent()}
      </div>
    </MainLayout>
  )
}

export default Wizard
