import { getRequest, postRequest } from '@/Admin/services'
import { type IAssetSchema } from '@/Admin/types'
import Link from '@/Components/Link'
import FormCreator from '@/Form/FormCreator'
import { type IFormValues, type IForm } from '@/Form/FormCreatorTypes'
import { typeToFormValues } from '@/helpers'
import { Button, Loader, Table, utils } from '@axdspub/axiom-ui-utilities'
import { CheckIcon, Cross1Icon, PlusIcon } from '@radix-ui/react-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState, type ReactElement } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const ListSchema = (): ReactElement => {
  const { data: schemas, isLoading } = useQuery<IAssetSchema[]>({
    queryKey: ['schema', 'list'],
    queryFn: async () => {
      const response = await getRequest<IAssetSchema[]>('/asset_schema')
      return response
    }
  })
  return (
    <div className='p-20 flex flex-col gap-4'>
      <div className='flex flex-row gap-4 justify-end'>
        <Link to='/manage/schema/add' className={utils.createButtonClass({
          size: 'xs',
          type: 'submit'
        })}>Add a new schema <PlusIcon className='inline ml-1' /></Link>
      </div>
      {
        isLoading
          ? <Loader />
          : <Table
              data={(schemas ?? [])}
              columns={[
                {
                  id: 'asset_type',
                  label: 'Asset type',
                  accessor: (row) => {
                    return <Link to={`/manage/schema/edit/${row.asset_type}/${row.schema_version}`}>{row.asset_type}</Link>
                  }
                },
                { id: 'schema_version', label: 'Schema version', cellClassName: 'text-right' },
                { id: 'is_type_default', label: 'Is type default?', accessor: (row) => row.is_type_default === true ? <CheckIcon color='green' className='mx-auto' /> : <Cross1Icon color='red' className='mx-auto' /> }
              ]}
            />
      }
    </div>
  )
}

export const EditSchema = (): ReactElement => {
  const { assetType, schemaVersion } = useParams()
  const { data: assetSchema, isLoading: schemaIsLoading } = useQuery<IAssetSchema>({
    queryKey: ['schema', assetType, schemaVersion],
    queryFn: async () => {
      const response = await getRequest<IAssetSchema[]>('asset_schema', [
        `asset_type=eq.${assetType}`,
        `schema_version=eq.${schemaVersion}`
      ])
      return response[0]
    }
  })

  return (
    <div className='p-20'>
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
    return 'Asset type is required'
  }
  if (!stringFieldIsSet(formValues.schema_version)) {
    return 'Schema version is required'
  }
  if (formValues.schema === undefined || formValues.schema === null) {
    return 'Asset schema is required'
  }
  return undefined
}

export const AddSchema = (): ReactElement => {
  return <SchemaForm />
}

const SchemaForm = ({ assetSchema }: { assetSchema?: IAssetSchema }): ReactElement => {
  const form: IForm = {
    id: 'schema',
    label: 'Add a new schema',
    fields: [
      {
        id: 'asset_type',
        label: 'Asset type',
        type: 'text',
        required: true
      },
      {
        id: 'schema_version',
        label: 'Schema version',
        type: 'text',
        required: true
      },
      {
        id: 'is_type_default',
        label: 'Is type default?',
        type: 'boolean'
      },
      {
        id: 'schema',
        label: 'Asset schema',
        type: 'json',
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

  <div className='p-20'>
        <FormCreator form={form} error={error} formValueState={[formValues, setFormValues]} />
        <Button type='submit' disabled={!isValid} onClick={() => {
          if (isValid) {
            console.log('Submitting form', formValues)
            postRequest('asset_schema', formValues as unknown as JSON)
              .then((response) => {
                console.log('Response', response)
                queryClient.invalidateQueries({
                  queryKey: ['schema', assetSchema?.asset_type, assetSchema?.schema_version]
                }).then(() => {
                  navigate('/manage/schema')
                }).catch(e => {
                  console.log('Error', e)
                })
              })
              .catch(e => {
                console.log('Error', e)
                // document.location.href = '/manage/schema'
              })
          }
        }}>Submit</Button>
    </div>
  )
}
