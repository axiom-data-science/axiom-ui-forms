import testForm from ***REMOVED***@/Form/testData/testForm***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***

const MapTester = (): ReactElement => {
  const [inputObject, setInputObject] = useState(testForm)
  const [error, setError] = useState<string | undefined>(undefined)
  const [str, setStr] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (str !== ***REMOVED******REMOVED*** && str !== undefined) {
      try {
        const ob = JSON.parse(str)
        setInputObject(ob)
      } catch {
        setError(***REMOVED***Invalid JSON***REMOVED***)
      }
    }
  }, [str])
  return (
        <div className=***REMOVED***p-20***REMOVED***>
            <h1 className=***REMOVED***font-bold***REMOVED***>Map Tester</h1>
            <div className=***REMOVED***flex flex-row w-full gap-4***REMOVED***>
                <div>
                    { error !== undefined
                      ? <p className=***REMOVED***text-red-500 py-4***REMOVED***>
                         {error}
                     </p>
                      : ***REMOVED******REMOVED***
                    }

                <TextArea
                    label=***REMOVED***Input object***REMOVED***
                    id=***REMOVED***object***REMOVED***
                    testId=***REMOVED***object***REMOVED***
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
