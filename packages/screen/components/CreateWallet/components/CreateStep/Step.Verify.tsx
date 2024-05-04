import { Button } from '@wallet/ui'
import { cx } from '@wallet/utils'
import compact from 'lodash/compact'
import isEqual from 'lodash/isEqual'
import { shuffle } from 'lodash'
import sampleSize from 'lodash/sampleSize'
import { useEffect, useMemo, useState } from 'react'

import { useCreateWalletContext } from '../../context/CreateWalletContext'
import { useTranslation } from 'react-i18next'
const StepVerify = () => {
  const { t } = useTranslation()
  const [verifyList, setVerifyList] = useState<string[]>(['', ''])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const { state, onVerify, onChangeSamplePhrase} = useCreateWalletContext()
  const { generatedPhrase, sampleVerifyPhrase } = state

  const onSelectIndex = (index: number) => () => {
    setSelectedIndex(index)
  }

  const onSelectWord = (word: string) => () => {
    const newVerifyList = [...verifyList]
    newVerifyList[selectedIndex] = word
    setVerifyList(newVerifyList)
    if (selectedIndex < 1) {
      setSelectedIndex(1)
    }
  }

  const shuffleArray = useMemo(() => {
    return shuffle(generatedPhrase)
  }, [])

  useEffect(() => {
    if (sampleVerifyPhrase?.length === 0) {
      const challengeSample = sampleSize(generatedPhrase, 2)
      onChangeSamplePhrase?.(challengeSample)
    }
  }, [])

  const validate = () => {
    if (compact(verifyList).length < 2) return false
    return isEqual(verifyList, sampleVerifyPhrase)
  }

  const isValid = validate()
  const isError =
    compact(verifyList).length === 2 && !isEqual(verifyList, sampleVerifyPhrase)

  return (
    <>
      <div className="my-6 text-ui04">
        {t('step_verify.choose_correct_words_following')}
      </div>

      <div>
        {sampleVerifyPhrase.map((word, _index) => {
          const findIndex = generatedPhrase.findIndex((w) => w === word)
          const renderIndex = findIndex + 1
          const isActive = selectedIndex === _index
          return (
            <div
              key={_index}
              className={cx(
                'bg-ui01 px-3 py-4 mb-2 border-[1px] border-ui02 cursor-pointer',
                isActive && 'border-ui04'
              )}
              onClick={onSelectIndex(_index)}>
              <span className="mr-2 text-ui04">{renderIndex}</span>
              <span className='text-ui04'>{verifyList[_index]}</span>
            </div>
          )
        })}
      </div>

      <ul className="columns-4 justify-between gap-3 mb-3 mt-4">
        {shuffleArray.map((word) => {
          return (
            <li
              key={word}
              className="bg-ui01 mb-3 text-tiny text-center text-ui04 cursor-pointer"
              onClick={onSelectWord(word)}>
              <div className="px-4 py-2 flex items-center justify-center">{word}</div>
            </li>
          )
        })}
      </ul>

      {isError && (
        <div className="w-full text-center text-red text-tiny">
          {t('step_verify.entered_the_wrong_words_order')}
        </div>
      )}

      <div className="mt-auto">
        <Button isBlock onClick={onVerify} disabled={!isValid}>
          {t('step_verify.verify')}
        </Button>
      </div>
    </>
  )
}

export default StepVerify
