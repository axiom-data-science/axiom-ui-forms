import oilSchema from ***REMOVED***./OpenOilModelConfig.json***REMOVED***
import fieldOverrides from ***REMOVED***../fieldOverrides***REMOVED***
import oilFieldOverrides from ***REMOVED***./oilFieldOverrides***REMOVED***
import oilFormOverride from ***REMOVED***./oilFormOverride***REMOVED***
import React, { useContext, type ReactElement } from ***REMOVED***react***REMOVED***
import { SchemaFormCreator } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import { FormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { CheckIcon, CopyIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***

const Footer = (): ReactElement => {
  const { formValues } = useContext(FormContext)
  return (
        <div className=***REMOVED***p-20***REMOVED***>
        <CopyButton
            string={JSON.stringify(formValues, null, 2)}
            OnCopiedElement={<><CheckIcon className=***REMOVED*** inline***REMOVED*** /> Copied to clipboard</>}
            ToCopyElement={<><CopyIcon className=***REMOVED*** inline***REMOVED*** /> Copy form output</>}
        />
        </div>

  )
}

const OilForm = (): ReactElement => {
  return (
        <SchemaFormCreator
            className=***REMOVED***p-20***REMOVED***
            id=***REMOVED***oil***REMOVED***
            label=***REMOVED***Oil Model Configuration***REMOVED***
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
