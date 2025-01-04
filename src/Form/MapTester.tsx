import testForm from '@/Form/testData/testForm'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import React, { useEffect, useState, type ReactElement } from 'react'

const MapTester = (): ReactElement => {
  const [inputObject, setInputObject] = useState(testForm)
  const [error, setError] = useState<string | undefined>(undefined)
  const [str, setStr] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (str !== '' && str !== undefined) {
      try {
        const ob = JSON.parse(str)
        setInputObject(ob)
      } catch {
        setError('Invalid JSON')
      }
    }
  }, [str])
  return (
        <div className='p-20'>
            <h1 className='font-bold'>Map Tester</h1>
            <div className='flex flex-row w-full gap-4'>
                <div>
                    { error !== undefined
                      ? <p className='text-red-500 py-4'>
                         {error}
                     </p>
                      : ''
                    }

                <TextArea
                    label='Input object'
                    id='object'
                    testId='object'
                    value={JSON.stringify(inputObject, null, 2)}
                    onChange={(e) => {
                      setStr(e)
                    }}
                />
                                </div>
                <div>
                    {
                        Object.keys(inputObject).map((key) => {
                          return (
                                <div key={key}>
                                    <h2>{key}</h2>
                                </div>
                          )
                        })
                    }

                </div>

            </div>

        </div>
  )
}

export default MapTester
