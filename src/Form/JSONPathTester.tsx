import { type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { JSONPath } from 'jsonpath-plus'
import React, { type ReactElement } from 'react'

const JsonPathTester = (): ReactElement => {
  const values: IFormValues = {
    top: [
      {
        value: 'top value',
        mid: [
          {
            bottom: 'value'
          }
        ]
      }
    ]
  }

  const val = JSONPath({
    path: '$.top[0].mid[0].bottom',
    json: values
  })

  return (
    <p>{val}</p>
  )
}
export default JsonPathTester
