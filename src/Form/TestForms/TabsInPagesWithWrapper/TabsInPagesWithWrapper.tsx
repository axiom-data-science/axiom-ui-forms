import { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import form from ***REMOVED***./form.json***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { IForm, IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const TabsInPagesWithWrapper = (): ReactElement => {
  const formState = useState<IForm | undefined>(form as IForm)

  return (
    <>
      <FormWithEditorOverlay formState={formState} />
    </>
  )
}

export default TabsInPagesWithWrapper
