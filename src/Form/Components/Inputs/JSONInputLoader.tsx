import { type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Loader } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { lazy, Suspense, type ReactElement } from ***REMOVED***react***REMOVED***

const JSONInput = lazy(async () => await import(***REMOVED***./JSON***REMOVED***))
const JSONInputLoader = (props: IFieldInputProps): ReactElement => {
  return (
      <>
        <Suspense fallback={<div className=***REMOVED***h-[500px]***REMOVED***><Loader className=***REMOVED***pt-20***REMOVED*** /></div>}>
            <JSONInput {...props} />
        </Suspense>
      </>
  )
}

export default JSONInputLoader
