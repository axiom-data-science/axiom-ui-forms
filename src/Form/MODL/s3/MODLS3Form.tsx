import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import form from './form.json'
import { IForm } from '@/Form/Creator/FormCreatorTypes'


const MODLForm = (): ReactElement => {
  const formState = useState<IForm | undefined>(form as IForm)
  return <FormWithEditorOverlay formState={formState} />
  
}

export default MODLForm
