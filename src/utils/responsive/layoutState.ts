import { atom } from 'jotai'

type ISize = 'sm' | 'md' | 'lg' | 'xl'

export const getWindowSize = (): ISize => {
  const width = window.innerWidth
  if (width < 768) return 'sm'
  if (width < 1024) return 'md'
  if (width < 1280) return 'lg'
  return 'xl'
}

const layoutAtom = atom<{ size: ISize }>({
  size: getWindowSize()
})

export default layoutAtom
