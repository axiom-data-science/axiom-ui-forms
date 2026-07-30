import React from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SchemaFormCreator } from '@/Form/Creator/FormCreator'
import { getFormPayload } from '@/utils/getters'
import type { IForm, IFormValues } from '@/Form/Creator/FormCreatorTypes'
import type { JSONSchema6 } from 'json-schema'
import schema from './oneOfObject.schema.json'

const PayloadFooter = ({ formValues, form }: { formValues: IFormValues; form: IForm }): React.ReactElement => {
  const payload = getFormPayload(formValues, form)
  return <pre data-testid="payload">{JSON.stringify(payload)}</pre>
}

describe('OneOfObjectSchema integration', () => {
  it('removes stale oneOf branch values from payload after selector switch', async () => {
    render(
      <SchemaFormCreator
        id="oneof-integration"
        label="OneOf Object Schema Demo"
        schema={schema as unknown as JSONSchema6}
        initialFormValues={{
          field1: 'seed-value',
          transport: {
            select_transport: 'S3',
            bucket: 'my-bucket',
            prefix: 'incoming/',
          },
        }}
        Footer={PayloadFooter as any}
      />
    )

    const readPayload = (): Record<string, unknown> => {
      const raw = screen.getByTestId('payload').textContent ?? '{}'
      return JSON.parse(raw)
    }

    await waitFor(() => {
      expect(readPayload()).toEqual({
        field1: 'seed-value',
        transport: {
          bucket: 'my-bucket',
          prefix: 'incoming/',
        },
      })
    })

    const selector = screen.getByRole('combobox', { name: /transport/i })
    fireEvent.click(selector)
    fireEvent.click(screen.getByText('HTTP'))

    await waitFor(() => {
      expect(readPayload()).toEqual({
        field1: 'seed-value',
      })
    })
  })

  it('single-prop override view shows S3 fields when S3 is selected', async () => {
    render(
      <SchemaFormCreator
        id="oneof-single-prop"
        label="OneOf Object Schema Demo"
        schema={schema as unknown as JSONSchema6}
        formOverrides={[
          {
            fields: [{ prop: 'field1' }, { prop: 'transport' }],
          } as any,
        ]}
        initialFormValues={{
          field1: 'seed-value',
          transport: {
            select_transport: 'HTTP',
            url: 'https://example.com',
            method: 'GET',
          },
        }}
        Footer={PayloadFooter as any}
      />
    )

    expect(screen.queryByTestId('bucket')).toBeNull()

    const selector = screen.getAllByRole('combobox')[0]
    fireEvent.click(selector)
    fireEvent.click(screen.getByText('S3'))

    await waitFor(() => {
      expect(screen.getByTestId('bucket')).toBeInTheDocument()
      expect(screen.getByTestId('prefix')).toBeInTheDocument()
    })
  })

  it('object overrides view shows S3 fields when S3 is selected', async () => {
    render(
      <SchemaFormCreator
        id="oneof-overrides"
        label="OneOf Object Schema Demo (Overrides)"
        schema={schema as unknown as JSONSchema6}
        formOverrides={[
          {
            fields: [
              { prop: 'field1' },
              {
                prop: 'transport',
                fields: [
                  { prop: 'transport.select_transport', label: 'Transport Type' },
                  {
                    id: 's3-grid-wrapper',
                    type: 'objectWrapper',
                    layout: 'grid2',
                    conditions: {
                      dependsOn: 'transport.select_transport',
                      value: 'S3',
                    },
                    fields: [
                      { prop: 'transport.bucket', label: 'Bucket' },
                      { prop: 'transport.prefix', label: 'Prefix' },
                    ],
                  },
                  {
                    id: 'http-grid-wrapper',
                    type: 'objectWrapper',
                    layout: 'grid2',
                    conditions: {
                      dependsOn: 'transport.select_transport',
                      value: 'HTTP',
                    },
                    fields: [
                      { prop: 'transport.url', label: 'URL' },
                      { prop: 'transport.method', label: 'Method' },
                    ],
                  },
                ],
              },
            ],
          } as any,
        ]}
        initialFormValues={{
          field1: 'seed-value',
          transport: {
            select_transport: 'HTTP',
            url: 'https://example.com',
            method: 'GET',
          },
        }}
        Footer={PayloadFooter as any}
      />
    )

    expect(screen.queryByTestId('bucket')).toBeNull()

    const selector = screen.getAllByRole('combobox')[0]
    fireEvent.click(selector)
    fireEvent.click(screen.getByText('S3'))

    await waitFor(() => {
      expect(screen.getByTestId('bucket')).toBeInTheDocument()
      expect(screen.getByTestId('prefix')).toBeInTheDocument()
    })
  })
})
