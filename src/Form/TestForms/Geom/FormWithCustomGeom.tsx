import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import { IForm } from '@/Form/Creator/FormCreatorTypes'
import { ReactElement, useState } from 'react'
import form from './form.json'
import CustomGeomInput from '@/Form/TestForms/Geom/CustomGeomInput'

const FormWithCustomGeom = (): ReactElement => {
  const formState = useState<IForm | undefined>(form as IForm)

  return (
    <FormWithEditorOverlay
      formState={formState}
      inputOverrides={{ 'custom:geometry': CustomGeomInput }}
    />
  )
}

export default FormWithCustomGeom
