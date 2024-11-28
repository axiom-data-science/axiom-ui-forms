import { type IFormMapping } from '@/Form/FormMappingTypes'
import { atom } from 'jotai'

const formMappingAtom = atom<IFormMapping>({ fields: {}, $targetSchema: '' })
export default formMappingAtom
