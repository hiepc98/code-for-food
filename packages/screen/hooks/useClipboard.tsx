import { useRef } from 'react'
import { toast } from 'react-toastify'

const useClipboard = ({ t }: {t: any}) => {
  const timer = useRef<any>()
  const onPaste = () => {
    setTimeout(() => {
      document.execCommand('paste')
    }, 50)
  }

  const onCopy = async (data: string) => {
    await navigator.clipboard.writeText(data)
  }

  const onCopyWithTitle =
    (content: string, title: string = '') =>
    async () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(async () => {
        await onCopy(content)
        toast.dismiss()
        toast(t('hook_clipboard.content_is_copied', { content: title }) as any)
      }, 100)
    }

  return { onPaste, onCopy, onCopyWithTitle }
}

export default useClipboard
