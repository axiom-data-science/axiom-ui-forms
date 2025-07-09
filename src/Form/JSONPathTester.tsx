import { type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { JSONPath } from ***REMOVED***jsonpath-plus***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const JsonPathTester = (): ReactElement => {
  const values: IFormValues = {
    top: [
      {
        value: ***REMOVED***top value***REMOVED***,
        mid: [
          {
            bottom: ***REMOVED***value***REMOVED***
          }
        ]
      }
    ]
  }

  const val = JSONPath({
    path: ***REMOVED***$.top[0].mid[0].bottom***REMOVED***,
    json: values
  })

  return (
    <p>{val}</p>
  )
}
export default JsonPathTester
