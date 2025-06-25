import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps, type ITextField } from '@/Form/Creator/FormCreatorTypes'
import { type ISensorStationRecord, type ISensorStationSearchResponse } from '@/WaterLevel/types'
import { Input, Loader, Tooltip } from '@axdspub/axiom-ui-utilities'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import React, { useState, type ReactElement } from 'react'

const StationSearch = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const textField = field as ITextField
  const [searchValue, setSearchValue] = useState<string | undefined>()
  const [selectedRecord, setSelectedRecord] = useState<ISensorStationRecord | undefined>(undefined)

  const { data, isLoading, error } = useQuery<ISensorStationSearchResponse>({
    queryKey: [searchValue],
    enabled: searchValue !== undefined && searchValue.length > 0, // Only run the query if searchValue is defined
    queryFn: async () => {
      const response = await fetch(`https://search.axds.co/v2/search?portalId=-1&page=1&pageSize=100&type=sensor_station&query=${encodeURIComponent(searchValue ?? '')}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return await response.json()
    }
  })

  return <div className='relative'>
    {selectedRecord !== undefined
      ? <div className='p-2 bg-gray-100 flex flex-row align-middle gap-4'>
        <Tooltip content={'Clear selection'} contentClassName='max-w-[200px]'>
       <Cross2Icon className='w-6 h-6 cursor-pointer flex-none opacity-40 hover:opacity-100' onClick={() => {
         setSelectedRecord(undefined)
       }} />
       </Tooltip><div>
                <div className='font-semibold'>{selectedRecord.label}</div>
                <div className='text-sm text-gray-600'>{selectedRecord.uuid}</div>
              </div>
    </div>
      : <>
      <Input
        id={field.id}
        testId={field.id}
        value={searchValue}
        placeholder={textField.placeholder ?? 'Enter search term'}
        label={<FieldLabel {...field} />}
        onChange={(e) => {
          setSearchValue(e)
        }}
    />
    {
        (isLoading || data !== undefined) && (
            <div className='absolute left-0 right-0 top-full z-10 bg-white border border-gray-300 shadow-lg h-60 overflow-y-auto'>
            {isLoading && <Loader className='absolute top-10' />}
            {error !== null && <p className='p-4 text-red-600'>Error: {error.message}</p>}
            {
                data?.results.map((station) => (
                    <div key={station.uuid} className='p-2 hover:bg-gray-100 cursor-pointer' onClick={() => {
                      setSelectedRecord(station)
                    }}>
                        <div className='font-semibold'>{station.label}</div>
                        <div className='text-sm text-gray-600'>{station.uuid}</div>
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
