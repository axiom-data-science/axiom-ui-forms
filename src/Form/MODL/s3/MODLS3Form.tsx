import { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import form from ***REMOVED***./form.json***REMOVED***
import { IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***


const MODLForm = (): ReactElement => {
  const formState = useState<IForm | undefined>(form as IForm)
  return <FormWithEditorOverlay formState={formState} />
  
}

export default MODLForm
