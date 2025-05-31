import { type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import fieldOverrides from ***REMOVED***@/PTT/fieldOverrides***REMOVED***
import { atom } from ***REMOVED***jotai***REMOVED***
const rootFieldAtom = atom<IFormFieldOverride[]>(fieldOverrides)
export default rootFieldAtom
