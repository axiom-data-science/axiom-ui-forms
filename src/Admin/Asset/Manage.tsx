import { getRequest } from ***REMOVED***@/Admin/services***REMOVED***
import { type IAssetSchema, type IAsset } from ***REMOVED***@/Admin/types***REMOVED***
import FormCreator from ***REMOVED***@/Form/FormCreator***REMOVED***
import { type IFormValues, type IForm } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { Button, Loader } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useQuery } from ***REMOVED***@tanstack/react-query***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***

export const ListAssets = (): ReactElement => {
  return <p>List of all the assets. Each should have a view, edit, copy and delete button</p>
}

const stringFieldIsSet = (field: string | undefined): boolean => {
  return field !== undefined && field.length > 0
}

const getErrors = (formValues: Record<string, any>): string | undefined => {
  if (!stringFieldIsSet(formValues.asset_type)) {
    return ***REMOVED***Asset type is required***REMOVED***
  }
  if (!stringFieldIsSet(formValues.schema_version)) {
    return ***REMOVED***Schema version is required***REMOVED***
  }
  return undefined
}

export const AddAsset = (): ReactElement => {
  return <AssetForm />
}

export const EditAsset = (): ReactElement => {
  const { assetKey } = useParams()
  const { data: asset, isLoading: assetIsLoading } = useQuery<IAsset>({
    queryKey: [***REMOVED***schema***REMOVED***, assetKey],
    queryFn: async () => {
      const response = await getRequest<IAsset[]>(***REMOVED***asset***REMOVED***, [
          `asset_key=eq.${assetKey}`
      ])
      return response[0]
    }
  })

  return (
      <div className=***REMOVED***p-20***REMOVED***>
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
    queryKey: [***REMOVED***schema***REMOVED***, ***REMOVED***list***REMOVED***],
    queryFn: async () => {
      const response = await getRequest<IAssetSchema[]>(***REMOVED***/asset_schema***REMOVED***)
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
    id: ***REMOVED***asset***REMOVED***,
    label: ***REMOVED***Add a new asset***REMOVED***,
    fields: [
      {
        id: ***REMOVED***type***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        layout: ***REMOVED***horizontal***REMOVED***,
        skip_path: true,
        fields: [

          {
            id: ***REMOVED***asset_type***REMOVED***,
            label: ***REMOVED***Asset type***REMOVED***,
            type: ***REMOVED***select***REMOVED***,
            options: schemas?.map((schema) => ({ value: schema.asset_type, label: schema.asset_type })),
            required: true
          },
          {
            id: ***REMOVED***schema_version***REMOVED***,
            label: ***REMOVED***Schema version***REMOVED***,
            type: ***REMOVED***select***REMOVED***,
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

  return <div className=***REMOVED***p-20***REMOVED***>
        {
          isLoading
            ? <Loader />
            : <>
        <FormCreator form={form} error={error} formValueState={[formValues, setFormValues]} />
        <Button type=***REMOVED***submit***REMOVED*** disabled={!isValid} onClick={() => {
          if (isValid) {
            console.log(***REMOVED***Submitting form***REMOVED***, formValues)
          }
        }}>Submit</Button>
        <pre className=***REMOVED***mt-10 p-4 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValues, null, 2)}</pre>
        </>
      }
    </div>
}
