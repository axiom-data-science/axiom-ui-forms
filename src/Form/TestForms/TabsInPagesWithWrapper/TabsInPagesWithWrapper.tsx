import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import form from './form.json'
import { ReactElement, useState } from 'react'
import { IForm, IFormOverride } from '@/Form/Creator/FormCreatorTypes'

const TabsInPagesWithWrapper = (): ReactElement => {
  const formState = useState<IForm | undefined>(form as IForm)

  return (
    <>
      <FormWithEditorOverlay formState={formState} />
    </>
  )
}

export default TabsInPagesWithWrapper
