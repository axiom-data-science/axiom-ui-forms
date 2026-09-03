import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import ObjectInput from './Object'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'

const { fieldCreatorSpy } = vi.hoisted(() => ({
  fieldCreatorSpy: vi.fn(),
}))

vi.mock('@/Form/Creator/FormContextProvider', () => ({
  useFormContext: () => ({
    form: { id: 'test-form' },
    setFormValues: vi.fn(),
  }),
  useFormValues: () => ({
    cache_enabled: true,
    cache_ttl: 3600,
  }),
}))

vi.mock('@/Form/Components/FieldLabel', () => ({
  default: () => <div data-testid="field-label" />,
}))

vi.mock('@/Form/Components/FieldCreator', () => ({
  default: (props: any) => {
    fieldCreatorSpy(props)
    return <div data-testid={`field-creator-${props.field?.id ?? 'unknown'}`} />
  },
}))

vi.mock('@/Form/Creator/TabLayout', () => ({
  default: ({ scopedValue }: any) => (
    <div data-testid="tab-layout" data-scoped={scopedValue !== undefined ? 'true' : 'false'} />
  ),
}))

vi.mock('@/Form/Creator/Page', () => ({
  default: () => <div data-testid="page-layout" />,
}))

vi.mock('@/Form/Creator/Wizard', () => ({
  default: () => <div data-testid="wizard-layout" />,
}))

describe('ObjectInput skip_path tabs scoping', () => {
  const fieldWithNestedTabs = {
    id: 'performance_wrapper',
    type: 'objectWrapper' as const,
    skip_path: true,
    tabs: [
      {
        id: 'caching',
        fields: [{ id: 'cache_enabled', type: 'boolean' as const }],
      },
    ],
  }

  it('renders root skip_path tabs in non-scoped mode when value is undefined', () => {
    const props: IFieldInputProps = {
      field: fieldWithNestedTabs as any,
      onChange: vi.fn(),
      value: undefined,
    }

    const { getByTestId } = render(<ObjectInput {...props} />)

    expect(getByTestId('tab-layout')).toHaveAttribute('data-scoped', 'false')
  })

  it('renders skip_path tabs in scoped mode when explicit scoped value is provided', () => {
    const props: IFieldInputProps = {
      field: fieldWithNestedTabs as any,
      onChange: vi.fn(),
      value: { cache_enabled: true },
    }

    const { getByTestId } = render(<ObjectInput {...props} />)

    expect(getByTestId('tab-layout')).toHaveAttribute('data-scoped', 'true')
  })
})

describe('ObjectInput skip_path objectWrapper child field scoping', () => {
  beforeEach(() => {
    fieldCreatorSpy.mockClear()
  })

  const fieldWithChildren = {
    id: 'wrapper',
    type: 'objectWrapper' as const,
    skip_path: true,
    fields: [{ id: 'prop4', type: 'text' as const }],
  }

  it('renders root skip_path wrapper child fields in non-scoped mode when value is undefined', () => {
    const props: IFieldInputProps = {
      field: fieldWithChildren as any,
      onChange: vi.fn(),
      value: undefined,
    }

    render(<ObjectInput {...props} />)

    const childFieldCall = fieldCreatorSpy.mock.calls.find(([callProps]) => callProps.field?.id === 'prop4')
    expect(childFieldCall?.[0].onChange).toBeUndefined()
    expect(childFieldCall?.[0].value).toBeUndefined()
  })

  it('renders wrapper child fields in scoped mode when explicit scoped value is provided', () => {
    const props: IFieldInputProps = {
      field: fieldWithChildren as any,
      onChange: vi.fn(),
      value: { prop4: 'k' },
    }

    render(<ObjectInput {...props} />)

    const childFieldCall = fieldCreatorSpy.mock.calls.find(([callProps]) => callProps.field?.id === 'prop4')
    expect(typeof childFieldCall?.[0].onChange).toBe('function')
    expect(childFieldCall?.[0].value).toBe('k')
  })
})
