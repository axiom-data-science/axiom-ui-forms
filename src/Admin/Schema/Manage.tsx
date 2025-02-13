import { getRequest, postRequest } from ***REMOVED***@/Admin/services***REMOVED***
import { type IAssetSchema } from ***REMOVED***@/Admin/types***REMOVED***
import Link from ***REMOVED***@/Components/Link***REMOVED***
import FormCreator from ***REMOVED***@/Form/FormCreator***REMOVED***
import { type IFormValues, type IForm } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { typeToFormValues } from ***REMOVED***@/helpers***REMOVED***
import { Button, Loader, Table, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CheckIcon, Cross1Icon, PlusIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { useQuery, useQueryClient } from ***REMOVED***@tanstack/react-query***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { useNavigate, useParams } from ***REMOVED***react-router-dom***REMOVED***

export const ListSchema = (): ReactElement => {
  const { data: schemas, isLoading } = useQuery<IAssetSchema[]>({
    queryKey: [***REMOVED***schema***REMOVED***, ***REMOVED***list***REMOVED***],
    queryFn: async () => {
      const response = await getRequest<IAssetSchema[]>(***REMOVED***/asset_schema***REMOVED***)
      return response
    }
  })
  return (
    <div className=***REMOVED***p-20 flex flex-col gap-4***REMOVED***>
      <div className=***REMOVED***flex flex-row gap-4 justify-end***REMOVED***>
        <Link to=***REMOVED***/manage/schema/add***REMOVED*** className={utils.createButtonClass({
          size: ***REMOVED***xs***REMOVED***,
          type: ***REMOVED***submit***REMOVED***
        })}>Add a new schema <PlusIcon className=***REMOVED***inline ml-1***REMOVED*** /></Link>
      </div>
      {
        isLoading
          ? <Loader />
          : <Table
              data={(schemas ?? [])}
              columns={[
                {
                  id: ***REMOVED***asset_type***REMOVED***,
                  label: ***REMOVED***Asset type***REMOVED***,
                  accessor: (row) => {
                    return <Link to={`/manage/schema/edit/${row.asset_type}/${row.schema_version}`}>{row.asset_type}</Link>
                  }
                },
                { id: ***REMOVED***schema_version***REMOVED***, label: ***REMOVED***Schema version***REMOVED***, cellClassName: ***REMOVED***text-right***REMOVED*** },
                { id: ***REMOVED***is_type_default***REMOVED***, label: ***REMOVED***Is type default?***REMOVED***, accessor: (row) => row.is_type_default === true ? <CheckIcon color=***REMOVED***green***REMOVED*** className=***REMOVED***mx-auto***REMOVED*** /> : <Cross1Icon color=***REMOVED***red***REMOVED*** className=***REMOVED***mx-auto***REMOVED*** /> }
              ]}
            />
      }
    </div>
  )
}

export const EditSchema = (): ReactElement => {
  const { assetType, schemaVersion } = useParams()
  const { data: assetSchema, isLoading: schemaIsLoading } = useQuery<IAssetSchema>({
    queryKey: [***REMOVED***schema***REMOVED***, assetType, schemaVersion],
    queryFn: async () => {
      const response = await getRequest<IAssetSchema[]>(***REMOVED***asset_schema***REMOVED***, [
        `asset_type=eq.${assetType}`,
        `schema_version=eq.${schemaVersion}`
      ])
      return response[0]
    }
  })

  return (
    <div className=***REMOVED***p-20***REMOVED***>
      {
        assetType === undefined || schemaVersion === undefined
          ? <div>Asset type and schema version are required</div>
          : schemaIsLoading || assetSchema === undefined
            ? <Loader />
            : <SchemaForm assetSchema={assetSchema} />

    }
    </div>
  )
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
  if (formValues.schema === undefined || formValues.schema === null) {
    return ***REMOVED***Asset schema is required***REMOVED***
  }
  return undefined
}

export const AddSchema = (): ReactElement => {
  return <SchemaForm />
}

const SchemaForm = ({ assetSchema }: { assetSchema?: IAssetSchema }): ReactElement => {
  const form: IForm = {
    id: ***REMOVED***schema***REMOVED***,
    label: ***REMOVED***Add a new schema***REMOVED***,
    fields: [
      {
        id: ***REMOVED***asset_type***REMOVED***,
        label: ***REMOVED***Asset type***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        required: true
      },
      {
        id: ***REMOVED***schema_version***REMOVED***,
        label: ***REMOVED***Schema version***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        required: true
      },
      {
        id: ***REMOVED***is_type_default***REMOVED***,
        label: ***REMOVED***Is type default?***REMOVED***,
        type: ***REMOVED***boolean***REMOVED***
      },
      {
        id: ***REMOVED***schema***REMOVED***,
        label: ***REMOVED***Asset schema***REMOVED***,
        type: ***REMOVED***json***REMOVED***,
        required: true
      }

    ]
  }

  const initialAssetType = useParams().type
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<IFormValues>(typeToFormValues(assetSchema))
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    setFormValues({
      asset_type: initialAssetType,
      ...formValues
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

  const queryClient = useQueryClient()

  return (

  <div className=***REMOVED***p-20***REMOVED***>
        <FormCreator form={form} error={error} formValueState={[formValues, setFormValues]} />
        <Button type=***REMOVED***submit***REMOVED*** disabled={!isValid} onClick={() => {
          if (isValid) {
            console.log(***REMOVED***Submitting form***REMOVED***, formValues)
            postRequest(***REMOVED***asset_schema***REMOVED***, formValues as unknown as JSON)
              .then((response) => {
                console.log(***REMOVED***Response***REMOVED***, response)
                queryClient.invalidateQueries({
                  queryKey: [***REMOVED***schema***REMOVED***, assetSchema?.asset_type, assetSchema?.schema_version]
                }).then(() => {
                  navigate(***REMOVED***/manage/schema***REMOVED***)
                }).catch(e => {
                  console.log(***REMOVED***Error***REMOVED***, e)
                })
              })
              .catch(e => {
                console.log(***REMOVED***Error***REMOVED***, e)
                // document.location.href = ***REMOVED***/manage/schema***REMOVED***
              })
          }
        }}>Submit</Button>
    </div>
  )
}
