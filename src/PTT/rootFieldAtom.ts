import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'
import fieldOverrides from '@/PTT/fieldOverrides'
import { atom } from 'jotai'
const rootFieldAtom = atom<IFormFieldOverride[]>(fieldOverrides)
export default rootFieldAtom
