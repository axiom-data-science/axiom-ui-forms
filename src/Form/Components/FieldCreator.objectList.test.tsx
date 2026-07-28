import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

  it('shows only key field until a unique key is entered when onlyShowKeyUntilUniqueEntered is true', () => {
    const objectListField: IFormField = {
      id: 'servers',
      type: 'objectList',
      label: 'Servers',
      settings: {
        keyField: 'hostname',
        valueField: 'ip',
        onlyShowKeyUntilUniqueEntered: true,
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
      servers: {},
    }

    const { rerender } = render(<FieldCreator field={objectListField} />)

    fireEvent.click(screen.getByRole('button', { name: /add first item/i }))

    expect(screen.getByTestId('mock-input-hostname')).toBeInTheDocument()
    expect(screen.queryByTestId('mock-input-ip')).toBeNull()

    fireEvent.change(screen.getByTestId('mock-input-hostname'), {
      target: { value: 'alpha' },
    })

    rerender(<FieldCreator field={objectListField} />)

    expect(screen.getByTestId('mock-input-ip')).toBeInTheDocument()
  })

  it('keeps pending duplicate rows key-only until the key becomes unique', () => {
    const objectListField: IFormField = {
      id: 'servers',
      type: 'objectList',
      label: 'Servers',
      settings: {
        keyField: 'hostname',
        valueField: 'ip',
        onlyShowKeyUntilUniqueEntered: true,
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

    const { rerender } = render(<FieldCreator field={objectListField} />)

    expect(screen.getAllByTestId('mock-input-ip')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: /^add/i }))

    const hostnameInputs = screen.getAllByTestId('mock-input-hostname')
    expect(hostnameInputs).toHaveLength(2)

    fireEvent.change(hostnameInputs[1], {
      target: { value: 'alpha' },
    })

    rerender(<FieldCreator field={objectListField} />)

    expect(screen.getAllByTestId('mock-input-ip')).toHaveLength(1)

    const updatedHostnameInputs = screen.getAllByTestId('mock-input-hostname')
    fireEvent.change(updatedHostnameInputs[1], {
      target: { value: 'bravo' },
    })

    rerender(<FieldCreator field={objectListField} />)

    expect(screen.getAllByTestId('mock-input-ip')).toHaveLength(2)
  })

  it('auto-shows initial object row when showInitialObject is true', async () => {
    const objectListField: IFormField = {
      id: 'servers',
      type: 'objectList',
      label: 'Servers',
      settings: {
        keyField: 'hostname',
        valueField: 'ip',
        showInitialObject: true,
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
      servers: {},
    }

    render(<FieldCreator field={objectListField} />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-input-hostname')).toBeInTheDocument()
      expect(screen.getByTestId('mock-input-ip')).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /add first item/i })).toBeNull()
  })
})
