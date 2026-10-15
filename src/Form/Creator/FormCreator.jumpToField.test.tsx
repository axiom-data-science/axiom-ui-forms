import { act, fireEvent, render, screen } from '@testing-library/react'
import React, { createRef } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import FormCreator, { type IFormCreatorHandle } from './FormCreator'
import SchemaFormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import { SchemaFormWithEditorOverlay as PublicSchemaFormWithEditorOverlay } from '@/Form'
import { type IForm } from './FormCreatorTypes'

const renderForm = (form: IForm, ref: React.RefObject<IFormCreatorHandle | null>): void => {
  render(
    <MemoryRouter>
      <FormCreator ref={ref} form={form} />
    </MemoryRouter>
  )
}

describe('FormCreator.jumpToField', () => {
  it('activates an inactive page, scrolls to the field, and highlights it', async () => {
    const ref = createRef<IFormCreatorHandle>()
    renderForm({
      id: 'form',
      label: 'Form',
      pages: [
        { id: 'first', label: 'First', fields: [{ id: 'firstField', type: 'text', label: 'First field' }] },
        { id: 'second', label: 'Second', fields: [{ id: 'target', type: 'text', label: 'Target' }] },
      ],
    }, ref)

    let navigation: Promise<boolean>
    act(() => {
      navigation = ref.current!.jumpToField('target')
    })
    const navigated = await navigation!

    expect(navigated).toBe(true)
    expect(document.querySelector('[data-field-path="target"]')).toHaveClass('ring-4', 'animate-pulse')
  })

  it('activates an inactive tab before locating the field', async () => {
    const ref = createRef<IFormCreatorHandle>()
    renderForm({
      id: 'form',
      label: 'Form',
      tabs: [
        { id: 'first', label: 'First', fields: [{ id: 'firstField', type: 'text', label: 'First field' }] },
        { id: 'second', label: 'Second', fields: [{ id: 'target', type: 'text', label: 'Target' }] },
      ],
    }, ref)

    let navigation: Promise<boolean>
    act(() => {
      navigation = ref.current!.jumpToField('target')
    })
    const navigated = await navigation!

    expect(document.querySelector('[role="tab"]')).not.toBeNull()
    expect(document.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toBe('Second')
    expect(navigated).toBe(true)
    expect(document.querySelector('[data-field-path="target"]')).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'First' }), { button: 0, ctrlKey: false })
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true')
  })

  it('returns false when the path does not exist', async () => {
    const ref = createRef<IFormCreatorHandle>()
    renderForm({
      id: 'form',
      label: 'Form',
      fields: [{ id: 'known', type: 'text', label: 'Known' }],
    }, ref)

    await expect(ref.current!.jumpToField('unknown')).resolves.toBe(false)
  })

  it('forwards the jump handle through FormWithEditorOverlay', async () => {
    const ref = createRef<IFormCreatorHandle>()
    render(
      <MemoryRouter>
        <FormWithEditorOverlay
          ref={ref}
          formState={[
            { id: 'form', label: 'Form', fields: [{ id: 'target', type: 'text', label: 'Target' }] },
            () => {},
          ]}
        />
      </MemoryRouter>
    )

    let navigation: Promise<boolean>
    act(() => {
      navigation = ref.current!.jumpToField('target')
    })
    await expect(navigation!).resolves.toBe(true)
  })

  it('forwards the jump handle through the publicly exported schema overlay', async () => {
    expect(PublicSchemaFormWithEditorOverlay).toBe(SchemaFormWithEditorOverlay)
    const ref = createRef<IFormCreatorHandle>()
    render(
      <MemoryRouter>
        <PublicSchemaFormWithEditorOverlay
          ref={ref}
          label="Schema form"
          schemaState={[
            {
              type: 'object',
              properties: { target: { type: 'string', title: 'Target' } },
            },
            () => {},
          ]}
        />
      </MemoryRouter>
    )

    let navigation: Promise<boolean>
    act(() => {
      navigation = ref.current!.jumpToField('target')
    })
    await expect(navigation!).resolves.toBe(true)
  })
})