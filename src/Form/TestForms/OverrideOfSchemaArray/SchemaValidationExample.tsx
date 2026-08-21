import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import schema from './schema.json'
import fieldOverrides from './fields.json'
import formOverride from './form.json'
import { JSONSchema6 } from 'json-schema'
import { IForm, IFormFieldOverride, IFormOverride, IFormValues } from '@/library'
import { Button } from '@axdspub/axiom-ui-utilities'
import { getFieldsFromFormSection } from '@/utils/getters'
import { overridesAndSchemaToFormObject, validateAgainstSchema } from '@/utils/schemaToFormHelpers'
import { get, omit } from 'lodash-es'


type IValidationError = { field: string; path?: string; message: string }

const SchemaValidationExample = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
  const formValueState = useState<IFormValues>({})
  const [validationState, setValidationState] = useState<{ valid: boolean; errors: IValidationError[] }>({ valid: true, errors: [] })
  const form: IForm = overridesAndSchemaToFormObject({
    formOverrides: [formOverride as IFormOverride],
    schema: schema as JSONSchema6,
    formFieldOverrides: [fieldOverrides as IFormFieldOverride[]],
  })
  const onValidate = async () => {
    const errors: IValidationError[] = []
    const [formValues] = formValueState
    let valid = true

    const flattenedFields = getFieldsFromFormSection(form)
    const fieldsById = Object.fromEntries(flattenedFields.map((f) => [f.id, f]))
    flattenedFields.forEach((f) => {
      if (f.required && (formValues[f.id] === undefined || formValues[f.id] === '')) {
        valid = false
        errors.push({
          field: f.id,
          message: `${f.label} is required.`,
        })
      }
    })
    if (schema !== undefined) {
      const againstSchema = validateAgainstSchema(
        omit(schema as any, '$schema'),
        formValues
      )
      if (againstSchema?.length) {
        valid = false
        againstSchema.forEach((e) => {
          const fieldKey = e.field?.length ? e.field : e.message.split(' ')[0].replace(/\//g, '.').replace(/^\./, '')
          const field = fieldsById[fieldKey as keyof typeof fieldsById]?.label ?? fieldKey
          const currentValue = get(formValues, fieldKey)
          if(!errors.find(e => e.field === fieldKey)){
            errors.push({
              field: fieldKey,
              message: `${field} ${e.message.split(' ').slice(1).join(' ')}${typeof currentValue !== 'undefined' ? `. Current value: ${JSON.stringify(currentValue)}` : ''}`,
            })
          }
        })
        
      }
    }
    setValidationState({ valid, errors })
  }
  return (
    <div className='flex flex-col gap-4'>
      {
        !validationState.valid && (
          <div className='text-red-500'>
            {validationState.errors.map((error, index) => (
              <div key={index}>{error.message}</div>
            ))}
          </div>
        )
      }
    <FormWithEditorOverlay
      label={'Test: schema validation'}
      schemaState={schemaState}
      formValueState={formValueState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      SubmitButton={
        <Button type='submit' onClick={()=>{
          onValidate()
        }}>Validate</Button>
      }
    />
    </div>
  )
}



export default SchemaValidationExample
