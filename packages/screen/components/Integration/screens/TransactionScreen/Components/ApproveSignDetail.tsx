import { CHAIN_DATA } from "@wallet/constants";
import { truncate } from "@wallet/utils";
import useClipboard from "../../../../../hooks/useClipboard";
import { get } from "lodash";
import { Icon, Image } from "@wallet/ui";
import useTokenLocal from "../../../../../hooks/useTokenLocal";
import RadioSelection from "@wallet/ui/components/RadioSelection/RadioSelection.component";
import { convertWeiToBalance, formatNumberBro } from "../../../../../utils";
import { UNLIMIT_HEX } from "@wallet/evm/src/constants/config";
import { useMemo } from "react";
import { lowerCase } from "../../../../../common/functions";


const ApproveSignDetail = (props : any) => {

  const {t, approveData, onChangeApproveUnlimited} = props


  
  const { onCopyWithTitle } = useClipboard({ t })
  const { tokensLocal } = useTokenLocal()


  const contractToken = get(approveData, 'domain.verifyingContract')
  const tokenDetail = tokensLocal.find(item => lowerCase(item.address) === lowerCase(contractToken))

  console.log('check', {tokenDetail, contractToken});
  


  const amountSpentWei = get(approveData, 'message.value')
  const isApprovedUnlimited = Number(amountSpentWei) >= Number(UNLIMIT_HEX)
  const amountSpent = convertWeiToBalance(String(Number(amountSpentWei)), get(tokenDetail,'decimal'))
  const spender = get(approveData, 'message.spender')



  const listStandard = [
    {
      title: `${formatNumberBro(amountSpent, 2)} ${get(tokenDetail, 'symbol', 'TOKEN')}`,
      value: 'standard'
    },
    {
      title: t('confirmation.unlimited', {symbol: get(tokenDetail, 'symbol', 'TOKEN')}),
      value: 'unlimited'
    },
  ]

  const handleChangeApproveAmount = (item) => {
    const isUnlimited = item.value === 'unlimited'
    onChangeApproveUnlimited && onChangeApproveUnlimited(isUnlimited)
    // onChangeIsOldWalletStandard?.(isOld)
  }

  return (
    <div>
      <div className="bg-ui01 mt-2 px-3 py-3">
        <div className="text-[14px] text-ui03 pb-2 flex justify-between border-b border-ui00 ">
          <div>{t('confirmation.contract_token')}</div>
          <div className="text-ui04 flex items-center" >
            {truncate(contractToken)}
            <Icon name="copy" onClick={onCopyWithTitle(contractToken as string, t('address'))} className="hover:opacity-50 cursor-pointer active:opacity-70 ml-2" />
          </div>
        </div>
        <div className="text-[14px] mt-2 text-ui03 flex justify-between">
          <div>{t('confirmation.contract_dapp')}</div>
          <div className="text-ui04 flex items-center" >
            {truncate(spender)}
            <Icon name="copy" onClick={onCopyWithTitle(spender as string, t('address'))} className="hover:opacity-50 cursor-pointer active:opacity-70 ml-2" />
          </div>
        </div>
      </div>
      {
        isApprovedUnlimited 
        ? (<div className="bg-ui01 flex px-3 py-3 mt-2 justify-between">
            <div >{t('confirmation.unlimited', {symbol: get(tokenDetail, 'symbol', 'TOKEN')})}</div>
            <div className="h-6 w-6 rounded-full overflow-hidden">
              <Image src={get(tokenDetail, 'image')} className="w-full h-full" />
            </div>
          </div>
        )
        : (
          <RadioSelection
            items={listStandard}
            onChange={handleChangeApproveAmount}
            defaultValue={listStandard[0]}
            optionClassName="px-2 py-2 mb-0"
            renderMethod={(item) => (
               <div className='flex items-center justify-between'>
                <p className='text-[12px] font-semibold text-ui04 truncate max-w-[200px]'>{item.title}</p>
                <div className="h-6 w-6 rounded-full overflow-hidden">
                  <Image src={get(tokenDetail, 'image')} className="w-full h-full" />
                </div>
              </div>
            )}
          />
        )
      }
    </div>
    
  );
}
 
export default ApproveSignDetail;