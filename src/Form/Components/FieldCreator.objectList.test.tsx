import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import FieldCreator from './FieldCreator'
import { type IForm, type IFormField, type IFormValues } from '@/Form/Creator/FormCreatorTypes'

let currentFormValues: IFormValues = {}
let currentForm: IForm = { id: 'test-form', label: 'Test Form', fields: [] }
const setFormValuesMock = vi.fn((nextValues: IFormValues) => {
  currentFormValues = nextValues
})

vi.mock('@/Form/Creator/FormContextProvider', () => ({
  useFormContext: () => ({
    form: currentForm,
    setFormValues: setFormValuesMock,
    inputOverrides: undefined,
    onChange: undefined,
  }),
  useFormValues: () => currentFormValues,
}))

vi.mock('@/Form/Components/FieldLabel', () => ({
  default: () => <div data-testid="field-label" />,
}))

vi.mock('@/utils/validators', () => ({
  checkCondition: () => ({ pass: true, result: 'include' }),
}))

vi.mock('@/utils/formEngine/conditionLogic', () => ({
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

vi.mock('@/Form/Components/Inputs/inputMap', () => ({
  default: {
    text: ({ field, value, onChange, disabled }: any) => (
      <input
        data-testid={`mock-input-${field.id}`}
        value={String(value ?? '')}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    ),
  },
}))

describe('FieldCreator objectList valueField mode', () => {
  beforeEach(() => {
    setFormValuesMock.mockClear()
    currentFormValues = {}
    currentForm = { id: 'test-form', label: 'Test Form', fields: [] }
  })

  it('stores objectList entries as key -> valueField scalar when editing valueField input', () => {
    const objectListField: IFormField = {
      id: 'servers',
      type: 'objectList',
      label: 'Servers',
      settings: {
        keyField: 'hostname',
        valueField: 'ip',
      },
      fields: [
        { id: 'hostname', type: 'text', label: 'Hostname' },
        { id: 'ip', type: 'text', label: 'IP Address' },
      ],
    } as any

    currentForm = {
      id: 'test-form',
      label: 'Test Form',
      fields: [objectListField],
    }
    currentFormValues = {
      servers: {
        alpha: '10.0.0.1',
      },
    }

    render(<FieldCreator field={objectListField} />)

    const ipInput = screen.getByTestId('mock-input-ip') as HTMLInputElement
    fireEvent.change(ipInput, { target: { value: '10.0.0.42' } })

    expect(setFormValuesMock).toHaveBeenCalled()
    const latestFormValues = setFormValuesMock.mock.calls[setFormValuesMock.mock.calls.length - 1][0]

    expect(latestFormValues).toEqual({
      servers: {
        alpha: '10.0.0.42',
      },
    })
  })

  it('moves scalar value to new key when keyField is renamed in valueField mode', () => {
    const objectListField: IFormField = {
      id: 'servers',
      type: 'objectList',
      label: 'Servers',
      settings: {
        keyField: 'hostname',
        valueField: 'ip',
      },
      fields: [
        { id: 'hostname', type: 'text', label: 'Hostname' },
        { id: 'ip', type: 'text', label: 'IP Address' },
      ],
    } as any

    currentForm = {
      id: 'test-form',
      label: 'Test Form',
      fields: [objectListField],
    }
    currentFormValues = {
      servers: {
        alpha: '10.0.0.1',
      },
    }

    render(<FieldCreator field={objectListField} />)

    const hostnameInput = screen.getByTestId('mock-input-hostname') as HTMLInputElement
    fireEvent.change(hostnameInput, { target: { value: 'bravo' } })

    expect(setFormValuesMock).toHaveBeenCalled()
    const latestFormValues =
      setFormValuesMock.mock.calls[setFormValuesMock.mock.calls.length - 1][0]

    expect(latestFormValues).toEqual({
      servers: {
        bravo: '10.0.0.1',
      },
    })
    expect((latestFormValues.servers as any).alpha).toBeUndefined()
  })
})
