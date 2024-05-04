import useRouting from '@wallet/screen/hooks/useRouting'
import { Icon } from '@wallet/ui'
import cn from 'classnames'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from 'store'

import { useWallet } from '~controllers/contexts/WalletContext'

interface MenuItem {
  name: string
  icon: string
  path: string
}

const menuList: MenuItem[] = [
  {
    name: 'Home',
    icon: 'menu_wallet',
    path: '/home'
  },
  {
    name: 'Points',
    icon: 'menu_stake',
    path: '/points'
  },
  {
    name: 'Setting',
    icon: 'menu_discover',
    path: '/setting'
  }
]

const MenuFooter = () => {
  const { navigateScreen } = useRouting()
  const activeNetwork = useAppSelector(state => state.setting.activeNetwork)
  const location = useLocation()
  const { services } = useWallet()

  const activeLink = (path: string) => location.pathname === path
  const menuListByNetwork = menuList

  if (!services || !services.isServiceLoaded) {
    return 
  }

  return (
    <div
      className={
        'bg-ui00 absolute w-full bottom-0 z-[100] flex flex-row justify-around items-center gap-4 border-t border-ui01'
      }>
      {menuListByNetwork.map((menu) => {
        const { name, icon, path } = menu

        return (
          <div
            key={path}
            className="group flex flex-col items-center gap-1 py-2 px-3 text-center cursor-pointer"
            onClick={navigateScreen(path)}>
            <Icon
              name={icon}
              className={cn(
                `text-[24px] font-semibold cursor-pointer group-hover:text-ui03 group-hover:transition-all ${
                  activeLink(menu.path) ? 'text-ui04' : 'text-ui02'
                }`,
                {}
              )}
            />
            <p
              className={cn(
                `text-sm group-hover:text-ui03 group-hover:transition-all ${
                  activeLink(menu.path) ? 'text-ui04' : 'text-ui02'
                }`,
                {}
              )}>
              {name}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default MenuFooter
