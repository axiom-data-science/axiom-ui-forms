import React from ***REMOVED***react***REMOVED***
import { describe, expect, it } from ***REMOVED***vitest***REMOVED***
import { fireEvent, render, screen, waitFor } from ***REMOVED***@testing-library/react***REMOVED***
import { SchemaFormCreator } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { getFormPayload } from ***REMOVED***@/utils/getters***REMOVED***
import type { IForm, IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import type { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import schema from ***REMOVED***./oneOfObject.schema.json***REMOVED***

const PayloadFooter = ({ formValues, form }: { formValues: IFormValues; form: IForm }): React.ReactElement => {
  const payload = getFormPayload(formValues, form)
  return <pre data-testid="payload">{JSON.stringify(payload)}</pre>
}

describe(***REMOVED***OneOfObjectSchema integration***REMOVED***, () => {
  it(***REMOVED***removes stale oneOf branch values from payload after selector switch***REMOVED***, async () => {
    render(
      <SchemaFormCreator
        id="oneof-integration"
        label="OneOf Object Schema Demo"
        schema={schema as unknown as JSONSchema6}
        initialFormValues={{
          field1: ***REMOVED***seed-value***REMOVED***,
          transport: {
            select_transport: ***REMOVED***S3***REMOVED***,
            bucket: ***REMOVED***my-bucket***REMOVED***,
            prefix: ***REMOVED***incoming/***REMOVED***,
          },
        }}
        Footer={PayloadFooter as any}
      />
    )

    const readPayload = (): Record<string, unknown> => {
      const raw = screen.getByTestId(***REMOVED***payload***REMOVED***).textContent ?? ***REMOVED***{}***REMOVED***
      return JSON.parse(raw)
    }

    await waitFor(() => {
      expect(readPayload()).toEqual({
        field1: ***REMOVED***seed-value***REMOVED***,
        transport: {
          bucket: ***REMOVED***my-bucket***REMOVED***,
          prefix: ***REMOVED***incoming/***REMOVED***,
        },
      })
    })

    const selector = screen.getByRole(***REMOVED***combobox***REMOVED***, { name: /transport/i })
    fireEvent.click(selector)
    fireEvent.click(screen.getByText(***REMOVED***HTTP***REMOVED***))

    await waitFor(() => {
      expect(readPayload()).toEqual({
        field1: ***REMOVED***seed-value***REMOVED***,
      })
    })
  })

  it(***REMOVED***single-prop override view shows S3 fields when S3 is selected***REMOVED***, async () => {
    render(
      <SchemaFormCreator
        id="oneof-single-prop"
        label="OneOf Object Schema Demo"
        schema={schema as unknown as JSONSchema6}
        formOverrides={[
          {
            fields: [{ prop: ***REMOVED***field1***REMOVED*** }, { prop: ***REMOVED***transport***REMOVED*** }],
          } as any,
        ]}
        initialFormValues={{
          field1: ***REMOVED***seed-value***REMOVED***,
          transport: {
            select_transport: ***REMOVED***HTTP***REMOVED***,
            url: ***REMOVED***https://example.com***REMOVED***,
            method: ***REMOVED***GET***REMOVED***,
          },
        }}
        Footer={PayloadFooter as any}
      />
    )

    expect(screen.queryByTestId(***REMOVED***bucket***REMOVED***)).toBeNull()

    const selector = screen.getAllByRole(***REMOVED***combobox***REMOVED***)[0]
    fireEvent.click(selector)
    fireEvent.click(screen.getByText(***REMOVED***S3***REMOVED***))

    await waitFor(() => {
      expect(screen.getByTestId(***REMOVED***bucket***REMOVED***)).toBeInTheDocument()
      expect(screen.getByTestId(***REMOVED***prefix***REMOVED***)).toBeInTheDocument()
    })
  })

  it(***REMOVED***object overrides view shows S3 fields when S3 is selected***REMOVED***, async () => {
    render(
      <SchemaFormCreator
        id="oneof-overrides"
        label="OneOf Object Schema Demo (Overrides)"
        schema={schema as unknown as JSONSchema6}
        formOverrides={[
          {
            fields: [
              { prop: ***REMOVED***field1***REMOVED*** },
              {
                prop: ***REMOVED***transport***REMOVED***,
                fields: [
                  { prop: ***REMOVED***transport.select_transport***REMOVED***, label: ***REMOVED***Transport Type***REMOVED*** },
                  {
                    id: ***REMOVED***s3-grid-wrapper***REMOVED***,
                    type: ***REMOVED***objectWrapper***REMOVED***,
                    layout: ***REMOVED***grid2***REMOVED***,
                    conditions: {
                      dependsOn: ***REMOVED***transport.select_transport***REMOVED***,
                      value: ***REMOVED***S3***REMOVED***,
                    },
                    fields: [
                      { prop: ***REMOVED***transport.bucket***REMOVED***, label: ***REMOVED***Bucket***REMOVED*** },
                      { prop: ***REMOVED***transport.prefix***REMOVED***, label: ***REMOVED***Prefix***REMOVED*** },
                    ],
                  },
                  {
                    id: ***REMOVED***http-grid-wrapper***REMOVED***,
                    type: ***REMOVED***objectWrapper***REMOVED***,
                    layout: ***REMOVED***grid2***REMOVED***,
                    conditions: {
                      dependsOn: ***REMOVED***transport.select_transport***REMOVED***,
                      value: ***REMOVED***HTTP***REMOVED***,
                    },
                    fields: [
                      { prop: ***REMOVED***transport.url***REMOVED***, label: ***REMOVED***URL***REMOVED*** },
                      { prop: ***REMOVED***transport.method***REMOVED***, label: ***REMOVED***Method***REMOVED*** },
                    ],
                  },
                ],
              },
            ],
          } as any,
        ]}
        initialFormValues={{
          field1: ***REMOVED***seed-value***REMOVED***,
          transport: {
            select_transport: ***REMOVED***HTTP***REMOVED***,
            url: ***REMOVED***https://example.com***REMOVED***,
            method: ***REMOVED***GET***REMOVED***,
          },
        }}
        Footer={PayloadFooter as any}
      />
    )

    expect(screen.queryByTestId(***REMOVED***bucket***REMOVED***)).toBeNull()

    const selector = screen.getAllByRole(***REMOVED***combobox***REMOVED***)[0]
    fireEvent.click(selector)
    fireEvent.click(screen.getByText(***REMOVED***S3***REMOVED***))

    await waitFor(() => {
      expect(screen.getByTestId(***REMOVED***bucket***REMOVED***)).toBeInTheDocument()
      expect(screen.getByTestId(***REMOVED***prefix***REMOVED***)).toBeInTheDocument()
    })
  })
})
