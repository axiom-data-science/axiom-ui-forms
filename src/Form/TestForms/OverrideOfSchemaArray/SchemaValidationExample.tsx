import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./schema.json***REMOVED***
import fieldOverrides from ***REMOVED***./fields.json***REMOVED***
import formOverride from ***REMOVED***./form.json***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { IForm, IFormFieldOverride, IFormOverride, IFormValues } from ***REMOVED***@/library***REMOVED***
import { Button } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { getFieldsFromFormSection } from ***REMOVED***@/utils/getters***REMOVED***
import { overridesAndSchemaToFormObject, validateAgainstSchema } from ***REMOVED***@/utils/schemaToFormHelpers***REMOVED***
import { get, omit } from ***REMOVED***lodash-es***REMOVED***


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
      if (f.required && (formValues[f.id] === undefined || formValues[f.id] === ***REMOVED******REMOVED***)) {
        valid = false
        errors.push({
          field: f.id,
          message: `${f.label} is required.`,
        })
      }
    })
    if (schema !== undefined) {
      const againstSchema = validateAgainstSchema(
        omit(schema as any, ***REMOVED***$schema***REMOVED***),
        formValues
      )
      if (againstSchema?.length) {
        valid = false
        againstSchema.forEach((e) => {
          const fieldKey = e.field?.length ? e.field : e.message.split(***REMOVED*** ***REMOVED***)[0].replace(/\//g, ***REMOVED***.***REMOVED***).replace(/^\./, ***REMOVED******REMOVED***)
          const field = fieldsById[fieldKey as keyof typeof fieldsById]?.label ?? fieldKey
          const currentValue = get(formValues, fieldKey)
          if(!errors.find(e => e.field === fieldKey)){
            errors.push({
              field: fieldKey,
              message: `${field} ${e.message.split(***REMOVED*** ***REMOVED***).slice(1).join(***REMOVED*** ***REMOVED***)}${typeof currentValue !== ***REMOVED***undefined***REMOVED*** ? `. Current value: ${JSON.stringify(currentValue)}` : ***REMOVED******REMOVED***}`,
            })
          }
        })
        
      }
    }
    setValidationState({ valid, errors })
  }
  return (
    <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
      {
        !validationState.valid && (
          <div className=***REMOVED***text-red-500***REMOVED***>
            {validationState.errors.map((error, index) => (
              <div key={index}>{error.message}</div>
            ))}
          </div>
        )
      }
    <FormWithEditorOverlay
      label={***REMOVED***Test: schema validation***REMOVED***}
      schemaState={schemaState}
      formValueState={formValueState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      SubmitButton={
        <Button type=***REMOVED***submit***REMOVED*** onClick={()=>{
          onValidate()
        }}>Validate</Button>
      }
    />
    </div>
  )
}



export default SchemaValidationExample
