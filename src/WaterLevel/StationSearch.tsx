import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps, type ITextField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type ISensorStationRecord, type ISensorStationSearchResponse } from ***REMOVED***@/WaterLevel/types***REMOVED***
import { Input, Loader, Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { Cross2Icon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { useQuery } from ***REMOVED***@tanstack/react-query***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const StationSearch = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const textField = field as ITextField
  const [searchValue, setSearchValue] = useState<string | undefined>()
  const [selectedRecord, setSelectedRecord] = useState<ISensorStationRecord | undefined>(undefined)

  const { data, isLoading, error } = useQuery<ISensorStationSearchResponse>({
    queryKey: [searchValue],
    enabled: searchValue !== undefined && searchValue.length > 0, // Only run the query if searchValue is defined
    queryFn: async () => {
      const response = await fetch(`https://search.axds.co/v2/search?portalId=-1&page=1&pageSize=100&type=sensor_station&query=${encodeURIComponent(searchValue ?? ***REMOVED******REMOVED***)}`, {
        headers: {
          ***REMOVED***Content-Type***REMOVED***: ***REMOVED***application/json***REMOVED***,
          Accept: ***REMOVED***application/json***REMOVED***
        }
      })
      if (!response.ok) {
        throw new Error(***REMOVED***Network response was not ok***REMOVED***)
      }
      return await response.json()
    }
  })

  return <div className=***REMOVED***relative***REMOVED***>
    {selectedRecord !== undefined
      ? <div className=***REMOVED***p-2 bg-gray-100 flex flex-row align-middle gap-4***REMOVED***>
        <Tooltip content={***REMOVED***Clear selection***REMOVED***} contentClassName=***REMOVED***max-w-[200px]***REMOVED***>
       <Cross2Icon className=***REMOVED***w-6 h-6 cursor-pointer flex-none opacity-40 hover:opacity-100***REMOVED*** onClick={() => {
         setSelectedRecord(undefined)
       }} />
       </Tooltip><div>
                <div className=***REMOVED***font-semibold***REMOVED***>{selectedRecord.label}</div>
                <div className=***REMOVED***text-sm text-gray-600***REMOVED***>{selectedRecord.uuid}</div>
              </div>
    </div>
      : <>
      <div className=***REMOVED***relative***REMOVED***>
      <Input
        id={field.id}
        testId={field.id}
        value={searchValue}
        placeholder={textField.placeholder ?? ***REMOVED***Enter search term***REMOVED***}
        label={<FieldLabel field={field} disabled={disabled} />}
        onChange={(e) => {
          setSearchValue(e)
        }}
    />
    <Cross2Icon className=***REMOVED***absolute right-2 bottom-3 w-6 h-6 cursor-pointer opacity-40 hover:opacity-100***REMOVED***
        onClick={() => {
          setSearchValue(undefined)
          setSelectedRecord(undefined)
        }} />
    </div>
    {
        (isLoading || data !== undefined) && (
            <div className=***REMOVED***absolute left-0 right-0 top-full z-40 bg-white border border-gray-300 shadow-lg h-60 overflow-y-auto***REMOVED***>
            {isLoading && <Loader className=***REMOVED***absolute top-10***REMOVED*** />}
            {error !== null && <p className=***REMOVED***p-4 text-red-600***REMOVED***>Error: {error.message}</p>}
            {
                data?.results.map((station) => (
                    <div key={station.uuid} className=***REMOVED***p-2 hover:bg-gray-100 cursor-pointer***REMOVED*** onClick={() => {
                      setSelectedRecord(station)
                    }}>
                        <div className=***REMOVED***font-semibold***REMOVED***>{station.label}</div>
                        <div className=***REMOVED***text-sm text-gray-600***REMOVED***>{station.uuid}</div>
                    </div>
                ))
            }
            </div>
        )
    }
    </>
    }
    </div>
}

export default StationSearch
