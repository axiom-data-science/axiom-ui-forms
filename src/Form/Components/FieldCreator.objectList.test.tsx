import React from ***REMOVED***react***REMOVED***
import { describe, it, expect, vi, beforeEach } from ***REMOVED***vitest***REMOVED***
import { fireEvent, render, screen, waitFor } from ***REMOVED***@testing-library/react***REMOVED***
import FieldCreator from ***REMOVED***./FieldCreator***REMOVED***
import { type IForm, type IFormField, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

let currentFormValues: IFormValues = {}
let currentForm: IForm = { id: ***REMOVED***test-form***REMOVED***, label: ***REMOVED***Test Form***REMOVED***, fields: [] }
const setFormValuesMock = vi.fn((nextValues: IFormValues) => {
  currentFormValues = nextValues
})

vi.mock(***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***, () => ({
  useFormContext: () => ({
    form: currentForm,
    setFormValues: setFormValuesMock,
    inputOverrides: undefined,
    onChange: undefined,
  }),
  useFormValues: () => currentFormValues,
}))

vi.mock(***REMOVED***@/Form/Components/FieldLabel***REMOVED***, () => ({
  default: () => <div data-testid="field-label" />,
}))

vi.mock(***REMOVED***@/utils/validators***REMOVED***, () => ({
  checkCondition: () => ({ pass: true, result: ***REMOVED***include***REMOVED*** }),
}))

vi.mock(***REMOVED***@/utils/formEngine/conditionLogic***REMOVED***, () => ({
  evaluateConditionStateUpdate: (
    _conditionResult: unknown,
    _field: unknown,
    _fieldValue: unknown,
    _form: unknown,
    _formValues: unknown,
    disabled: boolean | undefined
  ) => ({
    shouldUpdateFormValue: false,
    newFormValues: undefined,
    isExcluded: false,
    disabledState: { disabled: disabled ?? false },
  }),
}))

vi.mock(***REMOVED***@/Form/Components/Inputs/inputMap***REMOVED***, () => ({
  default: {
    text: ({ field, value, onChange, disabled }: any) => (
      <input
        data-testid={`mock-input-${field.id}`}
        value={String(value ?? ***REMOVED******REMOVED***)}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    ),
    objectWrapper: ({ field, value, onChange, disabled }: any) => {
      const objectValue = typeof value === ***REMOVED***object***REMOVED*** && value !== null ? value : {}
      return (
        <div data-testid={`mock-wrapper-${field.id}`}>
          {(field.fields ?? []).map((child: any) => (
            <input
              key={child.id}
              data-testid={`mock-input-${child.id}`}
              value={String(objectValue[child.id] ?? ***REMOVED******REMOVED***)}
              disabled={disabled}
              onChange={(e) =>
                onChange?.({
                  ...objectValue,
                  [child.id]: e.target.value,
                })
              }
            />
          ))}
        </div>
      )
    },
  },
}))

describe(***REMOVED***FieldCreator objectList valueField mode***REMOVED***, () => {
  beforeEach(() => {
    setFormValuesMock.mockClear()
    currentFormValues = {}
    currentForm = { id: ***REMOVED***test-form***REMOVED***, label: ***REMOVED***Test Form***REMOVED***, fields: [] }
  })

  it(***REMOVED***stores objectList entries as key -> valueField scalar when editing valueField input***REMOVED***, () => {
    const objectListField: IFormField = {
      id: ***REMOVED***servers***REMOVED***,
      type: ***REMOVED***objectList***REMOVED***,
      label: ***REMOVED***Servers***REMOVED***,
      settings: {
        keyField: ***REMOVED***hostname***REMOVED***,
        valueField: ***REMOVED***ip***REMOVED***,
      },
      fields: [
        { id: ***REMOVED***hostname***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Hostname***REMOVED*** },
        { id: ***REMOVED***ip***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***IP Address***REMOVED*** },
      ],
    } as any

    currentForm = {
      id: ***REMOVED***test-form***REMOVED***,
      label: ***REMOVED***Test Form***REMOVED***,
      fields: [objectListField],
    }
    currentFormValues = {
      servers: {
        alpha: ***REMOVED***10.0.0.1***REMOVED***,
      },
    }

    render(<FieldCreator field={objectListField} />)

    const ipInput = screen.getByTestId(***REMOVED***mock-input-ip***REMOVED***) as HTMLInputElement
    fireEvent.change(ipInput, { target: { value: ***REMOVED***10.0.0.42***REMOVED*** } })

    expect(setFormValuesMock).toHaveBeenCalled()
    const latestFormValues = setFormValuesMock.mock.calls[setFormValuesMock.mock.calls.length - 1][0]

    expect(latestFormValues).toEqual({
      servers: {
        alpha: ***REMOVED***10.0.0.42***REMOVED***,
      },
    })
  })

  it(***REMOVED***moves scalar value to new key when keyField is renamed in valueField mode***REMOVED***, () => {
    const objectListField: IFormField = {
      id: ***REMOVED***servers***REMOVED***,
      type: ***REMOVED***objectList***REMOVED***,
      label: ***REMOVED***Servers***REMOVED***,
      settings: {
        keyField: ***REMOVED***hostname***REMOVED***,
        valueField: ***REMOVED***ip***REMOVED***,
      },
      fields: [
        { id: ***REMOVED***hostname***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Hostname***REMOVED*** },
        { id: ***REMOVED***ip***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***IP Address***REMOVED*** },
      ],
    } as any

    currentForm = {
      id: ***REMOVED***test-form***REMOVED***,
      label: ***REMOVED***Test Form***REMOVED***,
      fields: [objectListField],
    }
    currentFormValues = {
      servers: {
        alpha: ***REMOVED***10.0.0.1***REMOVED***,
      },
    }

    render(<FieldCreator field={objectListField} />)

    const hostnameInput = screen.getByTestId(***REMOVED***mock-input-hostname***REMOVED***) as HTMLInputElement
    fireEvent.change(hostnameInput, { target: { value: ***REMOVED***bravo***REMOVED*** } })

    expect(setFormValuesMock).toHaveBeenCalled()
    const latestFormValues =
      setFormValuesMock.mock.calls[setFormValuesMock.mock.calls.length - 1][0]

    expect(latestFormValues).toEqual({
      servers: {
        bravo: ***REMOVED***10.0.0.1***REMOVED***,
      },
    })
    expect((latestFormValues.servers as any).alpha).toBeUndefined()
  })

  it(***REMOVED***shows only key field until a unique key is entered when onlyShowKeyUntilUniqueEntered is true***REMOVED***, () => {
    const objectListField: IFormField = {
      id: ***REMOVED***servers***REMOVED***,
      type: ***REMOVED***objectList***REMOVED***,
      label: ***REMOVED***Servers***REMOVED***,
      settings: {
        keyField: ***REMOVED***hostname***REMOVED***,
        valueField: ***REMOVED***ip***REMOVED***,
        onlyShowKeyUntilUniqueEntered: true,
      },
      fields: [
        { id: ***REMOVED***hostname***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Hostname***REMOVED*** },
        { id: ***REMOVED***ip***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***IP Address***REMOVED*** },
      ],
    } as any

    currentForm = {
      id: ***REMOVED***test-form***REMOVED***,
      label: ***REMOVED***Test Form***REMOVED***,
      fields: [objectListField],
    }
    currentFormValues = {
      servers: {},
    }

    const { rerender } = render(<FieldCreator field={objectListField} />)

    fireEvent.click(screen.getByRole(***REMOVED***button***REMOVED***, { name: /add first item/i }))

    expect(screen.getByTestId(***REMOVED***mock-input-hostname***REMOVED***)).toBeInTheDocument()
    expect(screen.queryByTestId(***REMOVED***mock-input-ip***REMOVED***)).toBeNull()

    fireEvent.change(screen.getByTestId(***REMOVED***mock-input-hostname***REMOVED***), {
      target: { value: ***REMOVED***alpha***REMOVED*** },
    })

    rerender(<FieldCreator field={objectListField} />)

    expect(screen.getByTestId(***REMOVED***mock-input-ip***REMOVED***)).toBeInTheDocument()
  })

  it(***REMOVED***keeps pending duplicate rows key-only until the key becomes unique***REMOVED***, () => {
    const objectListField: IFormField = {
      id: ***REMOVED***servers***REMOVED***,
      type: ***REMOVED***objectList***REMOVED***,
      label: ***REMOVED***Servers***REMOVED***,
      settings: {
        keyField: ***REMOVED***hostname***REMOVED***,
        valueField: ***REMOVED***ip***REMOVED***,
        onlyShowKeyUntilUniqueEntered: true,
      },
      fields: [
        { id: ***REMOVED***hostname***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Hostname***REMOVED*** },
        { id: ***REMOVED***ip***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***IP Address***REMOVED*** },
      ],
    } as any

    currentForm = {
      id: ***REMOVED***test-form***REMOVED***,
      label: ***REMOVED***Test Form***REMOVED***,
      fields: [objectListField],
    }
    currentFormValues = {
      servers: {
        alpha: ***REMOVED***10.0.0.1***REMOVED***,
      },
    }

    const { rerender } = render(<FieldCreator field={objectListField} />)

    expect(screen.getAllByTestId(***REMOVED***mock-input-ip***REMOVED***)).toHaveLength(1)

    fireEvent.click(screen.getByRole(***REMOVED***button***REMOVED***, { name: /^add/i }))

    const hostnameInputs = screen.getAllByTestId(***REMOVED***mock-input-hostname***REMOVED***)
    expect(hostnameInputs).toHaveLength(2)

    fireEvent.change(hostnameInputs[1], {
      target: { value: ***REMOVED***alpha***REMOVED*** },
    })

    rerender(<FieldCreator field={objectListField} />)

    expect(screen.getAllByTestId(***REMOVED***mock-input-ip***REMOVED***)).toHaveLength(1)

    const updatedHostnameInputs = screen.getAllByTestId(***REMOVED***mock-input-hostname***REMOVED***)
    fireEvent.change(updatedHostnameInputs[1], {
      target: { value: ***REMOVED***bravo***REMOVED*** },
    })

    rerender(<FieldCreator field={objectListField} />)

    expect(screen.getAllByTestId(***REMOVED***mock-input-ip***REMOVED***)).toHaveLength(2)
  })

  it(***REMOVED***auto-shows initial object row when showInitialObject is true***REMOVED***, async () => {
    const objectListField: IFormField = {
      id: ***REMOVED***servers***REMOVED***,
      type: ***REMOVED***objectList***REMOVED***,
      label: ***REMOVED***Servers***REMOVED***,
      settings: {
        keyField: ***REMOVED***hostname***REMOVED***,
        valueField: ***REMOVED***ip***REMOVED***,
        showInitialObject: true,
      },
      fields: [
        { id: ***REMOVED***hostname***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Hostname***REMOVED*** },
        { id: ***REMOVED***ip***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***IP Address***REMOVED*** },
      ],
    } as any

    currentForm = {
      id: ***REMOVED***test-form***REMOVED***,
      label: ***REMOVED***Test Form***REMOVED***,
      fields: [objectListField],
    }
    currentFormValues = {
      servers: {},
    }

    render(<FieldCreator field={objectListField} />)

    await waitFor(() => {
      expect(screen.getByTestId(***REMOVED***mock-input-hostname***REMOVED***)).toBeInTheDocument()
      expect(screen.getByTestId(***REMOVED***mock-input-ip***REMOVED***)).toBeInTheDocument()
    })
    expect(screen.queryByRole(***REMOVED***button***REMOVED***, { name: /add first item/i })).toBeNull()
  })

  it(***REMOVED***omits keyField from stored payload when excludeKeyFieldFromValue is true***REMOVED***, () => {
    const objectListField: IFormField = {
      id: ***REMOVED***servers***REMOVED***,
      type: ***REMOVED***objectList***REMOVED***,
      label: ***REMOVED***Servers***REMOVED***,
      settings: {
        keyField: ***REMOVED***hostname***REMOVED***,
        excludeKeyFieldFromValue: true,
        showInitialObject: true,
      },
      fields: [
        { id: ***REMOVED***hostname***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Hostname***REMOVED*** },
        { id: ***REMOVED***ip***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***IP Address***REMOVED*** },
      ],
    } as any

    currentForm = {
      id: ***REMOVED***test-form***REMOVED***,
      label: ***REMOVED***Test Form***REMOVED***,
      fields: [objectListField],
    }
    currentFormValues = {
      servers: {},
    }

    const { rerender } = render(<FieldCreator field={objectListField} />)

    fireEvent.change(screen.getByTestId(***REMOVED***mock-input-hostname***REMOVED***), {
      target: { value: ***REMOVED***alpha***REMOVED*** },
    })
    rerender(<FieldCreator field={objectListField} />)

    fireEvent.change(screen.getByTestId(***REMOVED***mock-input-ip***REMOVED***), {
      target: { value: ***REMOVED***10.0.0.1***REMOVED*** },
    })

    expect(setFormValuesMock).toHaveBeenCalled()
    const latestFormValues =
      setFormValuesMock.mock.calls[setFormValuesMock.mock.calls.length - 1][0]
    expect((latestFormValues.servers as any).alpha.ip).toBe(***REMOVED***10.0.0.1***REMOVED***)
    expect((latestFormValues.servers as any).alpha.hostname).toBeUndefined()
  })

  it(***REMOVED***commits values for wrapper-layout objectList entries to formValues***REMOVED***, () => {
    const objectListField: IFormField = {
      id: ***REMOVED***list***REMOVED***,
      type: ***REMOVED***objectList***REMOVED***,
      label: ***REMOVED***List***REMOVED***,
      settings: {
        keyField: ***REMOVED***name***REMOVED***,
        showInitialObject: true,
        excludeKeyFieldFromValue: true,
      },
      fields: [
        {
          id: ***REMOVED***wrapper***REMOVED***,
          type: ***REMOVED***objectWrapper***REMOVED***,
          layout: ***REMOVED***grid2***REMOVED***,
          fields: [
            { id: ***REMOVED***name***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Name***REMOVED*** },
            { id: ***REMOVED***value***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Value***REMOVED*** },
          ],
        } as any,
      ],
    } as any

    currentForm = {
      id: ***REMOVED***test-form***REMOVED***,
      label: ***REMOVED***Test Form***REMOVED***,
      fields: [objectListField],
    }
    currentFormValues = {
      list: {},
    }

    const { rerender } = render(<FieldCreator field={objectListField} />)

    fireEvent.change(screen.getByTestId(***REMOVED***mock-input-name***REMOVED***), {
      target: { value: ***REMOVED***alpha***REMOVED*** },
    })

    rerender(<FieldCreator field={objectListField} />)

    fireEvent.change(screen.getByTestId(***REMOVED***mock-input-value***REMOVED***), {
      target: { value: ***REMOVED***42***REMOVED*** },
    })

    expect(setFormValuesMock).toHaveBeenCalled()
    const latestFormValues =
      setFormValuesMock.mock.calls[setFormValuesMock.mock.calls.length - 1][0]

    expect(latestFormValues).toEqual({
      list: {
        alpha: {
          value: ***REMOVED***42***REMOVED***,
        },
      },
    })
  })
})
