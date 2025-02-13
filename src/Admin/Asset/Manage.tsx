import { getRequest } from '@/Admin/services'
import { type IAssetSchema, type IAsset } from '@/Admin/types'
import FormCreator from '@/Form/FormCreator'
import { type IFormValues, type IForm } from '@/Form/FormCreatorTypes'
import { Button, Loader } from '@axdspub/axiom-ui-utilities'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'

export const ListAssets = (): ReactElement => {
  return <p>List of all the assets. Each should have a view, edit, copy and delete button</p>
}

const stringFieldIsSet = (field: string | undefined): boolean => {
  return field !== undefined && field.length > 0
}

const getErrors = (formValues: Record<string, any>): string | undefined => {
  if (!stringFieldIsSet(formValues.asset_type)) {
    return 'Asset type is required'
  }
  if (!stringFieldIsSet(formValues.schema_version)) {
    return 'Schema version is required'
  }
  return undefined
}

export const AddAsset = (): ReactElement => {
  return <AssetForm />
}

export const EditAsset = (): ReactElement => {
  const { assetKey } = useParams()
  const { data: asset, isLoading: assetIsLoading } = useQuery<IAsset>({
    queryKey: ['schema', assetKey],
    queryFn: async () => {
      const response = await getRequest<IAsset[]>('asset', [
          `asset_key=eq.${assetKey}`
      ])
      return response[0]
    }
  })

  return (
      <div className='p-20'>
        {
          asset === undefined
            ? <div>Asset key is required</div>
            : assetIsLoading || asset === undefined
              ? <Loader />
              : <AssetForm asset={asset} />

      }
      </div>
  )
}

const AssetForm = ({ asset }: { asset?: IAsset }): ReactElement => {
  const initialAssetType = useParams().type
  const [formValues, setFormValues] = useState<IFormValues>({})
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const { data: schemas, isLoading } = useQuery<IAssetSchema[]>({
    queryKey: ['schema', 'list'],
    queryFn: async () => {
      const response = await getRequest<IAssetSchema[]>('/asset_schema')
      return response
    }
  })

  const [versions, setVersions] = useState<string[]>([])
  useEffect(() => {
    if (schemas !== undefined) {
      const assetTypeSchemas = schemas.filter((schema) => schema.asset_type === formValues.asset_type)
      const defaultVersion = assetTypeSchemas.find(s => s.is_type_default)?.schema_version ?? assetTypeSchemas?.[0]?.schema_version
      setFormValues({
        ...formValues,
        schema_version: defaultVersion
      })
      setVersions(assetTypeSchemas.map(s => s.schema_version))
    }
  }, [formValues.asset_type])

  const form: IForm = {
    id: 'asset',
    label: 'Add a new asset',
    fields: [
      {
        id: 'type',
        type: 'object',
        layout: 'horizontal',
        skip_path: true,
        fields: [

          {
            id: 'asset_type',
            label: 'Asset type',
            type: 'select',
            options: schemas?.map((schema) => ({ value: schema.asset_type, label: schema.asset_type })),
            required: true
          },
          {
            id: 'schema_version',
            label: 'Schema version',
            type: 'select',
            options: versions.map(v => {
              return { value: v, label: v }
            }),
            required: true
          }
        ]

      }

    ]
  }

  useEffect(() => {
    setFormValues({
      asset_type: initialAssetType
    })
  }, [initialAssetType])

  useEffect(() => {
    const newError = getErrors(formValues)
    if (newError !== undefined) {
      setError(newError)
      setIsValid(false)
    } else {
      setError(undefined)
      setIsValid(true)
    }
  }, [formValues])

  return <div className='p-20'>
        {
          isLoading
            ? <Loader />
            : <>
        <FormCreator form={form} error={error} formValueState={[formValues, setFormValues]} />
        <Button type='submit' disabled={!isValid} onClick={() => {
          if (isValid) {
            console.log('Submitting form', formValues)
          }
        }}>Submit</Button>
        <pre className='mt-10 p-4 bg-slate-200 text-xs'>{JSON.stringify(formValues, null, 2)}</pre>
        </>
      }
    </div>
}
