import { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import form from ***REMOVED***./form.json***REMOVED***
import CustomGeomInput from ***REMOVED***@/Form/TestForms/Geom/CustomGeomInput***REMOVED***

const FormWithCustomGeom = (): ReactElement => {
  const formState = useState<IForm | undefined>(form as IForm)

  return (
    <FormWithEditorOverlay
      formState={formState}
      inputOverrides={{ ***REMOVED***custom:geometry***REMOVED***: CustomGeomInput }}
    />
  )
}

export default FormWithCustomGeom
