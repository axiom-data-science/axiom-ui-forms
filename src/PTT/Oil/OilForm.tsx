import oilSchema from './OpenOilModelConfig.json'
import fieldOverrides from '../fieldOverrides'
import oilFieldOverrides from './oilFieldOverrides'
import oilFormOverride from './oilFormOverride'
import React, { useContext, type ReactElement } from 'react'
import { SchemaFormCreator } from '@/Form/Creator/FormCreator'
import { type JSONSchema6 } from 'json-schema'
import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { FormContext } from '@/Form/Creator/FormContextProvider'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'

const Footer = (): ReactElement => {
  const { formValues } = useContext(FormContext)
  return (
        <div className='p-20'>
        <CopyButton
            string={JSON.stringify(formValues, null, 2)}
            OnCopiedElement={<><CheckIcon className=' inline' /> Copied to clipboard</>}
            ToCopyElement={<><CopyIcon className=' inline' /> Copy form output</>}
        />
        </div>

  )
}

const OilForm = (): ReactElement => {
  return (
        <SchemaFormCreator
            className='p-20'
            id='oil'
            label='Oil Model Configuration'
            schema={oilSchema as JSONSchema6}
            formOverrides={[oilFormOverride]}
            formFieldOverrides={[fieldOverrides, oilFieldOverrides]}
            footer={
                <Footer />
            }
        />

  )
}

export default OilForm
