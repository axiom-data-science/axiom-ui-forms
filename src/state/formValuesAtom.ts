import { type IFormValues } from '@/Form/FormCreatorTypes'
import { atom } from 'jotai'

const formAtom = atom<IFormValues>({})
export default formAtom
