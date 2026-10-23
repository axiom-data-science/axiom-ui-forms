import { act, fireEvent, render, screen } from '@testing-library/react'
import React, { useMemo, type PropsWithChildren } from 'react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import FormCreator from './FormCreator'
import { FormUrlNavigationProvider } from './FormUrlNavigation'
import type { IForm } from './FormCreatorTypes'

const form = {
  id: 'url-navigation-test',
  label: 'URL navigation test',
  pages: [
    { id: 'first', label: 'First', fields: [{ id: 'firstField', type: 'text' as const, label: 'First field' }] },
    { id: 'second', label: 'Second', fields: [{ id: 'secondField', type: 'text' as const, label: 'Second field' }] },
  ],
}

const RouterNavigationProvider = ({ children }: PropsWithChildren): React.ReactElement => {
  const location = useLocation()
  const navigate = useNavigate()
  const adapter = useMemo(() => ({
    location: `${location.pathname}${location.search}${location.hash}`,
    navigate: (url: string, options?: { replace?: boolean }): void => {
      navigate(url, { replace: options?.replace })
    },
  }), [location.pathname, location.search, location.hash, navigate])

  return (
    <FormUrlNavigationProvider adapter={adapter}>
      {children}
      <output data-testid="router-location">
        {`${location.pathname}${location.search}${location.hash}`}
      </output>
    </FormUrlNavigationProvider>
  )
}

describe('FormCreator URL navigation', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/forms/page-form?campaign=spring')
  })

  afterEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('navigates without a router and preserves the host path and unrelated search parameters', () => {
    render(<FormCreator form={form} />)

    fireEvent.click(screen.getByRole('link', { name: 'Second' }))

    const url = new URL(window.location.href)
    expect(url.pathname).toBe('/forms/page-form')
    expect(url.searchParams.get('campaign')).toBe('spring')
    expect(JSON.parse(url.searchParams.get('__axiom_form_nav_url-navigation-test') ?? 'null')).toEqual(['second'])
    expect(screen.getByRole('textbox', { name: 'Second field' })).toBeInTheDocument()
  })

  it('initializes the active page from the form-specific query parameter', () => {
    window.history.replaceState({}, '', '/forms/page-form?__axiom_form_nav_url-navigation-test=%5B%22second%22%5D')

    render(<FormCreator form={form} />)

    expect(screen.getByRole('textbox', { name: 'Second field' })).toBeInTheDocument()
  })

  it('keeps section selection local when URL navigation is disabled', () => {
    render(<FormCreator form={{ ...form, settings: { url_navigable: false } }} />)

    fireEvent.click(screen.getByRole('button', { name: 'Second' }))

    expect(window.location.pathname).toBe('/forms/page-form')
    expect(window.location.search).toBe('?campaign=spring')
    expect(screen.getByRole('textbox', { name: 'Second field' })).toBeInTheDocument()
  })

  it('updates the active page when browser history changes the form query parameter', async () => {
    render(<FormCreator form={form} />)
    fireEvent.click(screen.getByRole('link', { name: 'Second' }))
    expect(screen.getByRole('textbox', { name: 'Second field' })).toBeInTheDocument()

    act(() => {
      window.history.pushState({}, '', '/forms/page-form?campaign=spring&__axiom_form_nav_url-navigation-test=%5B%22first%22%5D')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(await screen.findByRole('textbox', { name: 'First field' })).toBeInTheDocument()
  })

  it('synchronizes form navigation with a host React Router adapter', () => {
    render(
      <MemoryRouter initialEntries={['/site/forms?campaign=autumn']}>
        <RouterNavigationProvider>
          <FormCreator form={form} />
        </RouterNavigationProvider>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('link', { name: 'Second' }))

    const url = new URL(screen.getByTestId('router-location').textContent ?? '', 'http://localhost')
    expect(url.pathname).toBe('/site/forms')
    expect(url.searchParams.get('campaign')).toBe('autumn')
    expect(JSON.parse(url.searchParams.get('__axiom_form_nav_url-navigation-test') ?? 'null')).toEqual(['second'])
    expect(screen.getByRole('textbox', { name: 'Second field' })).toBeInTheDocument()
  })

  it('updates the URL when navigating top-level wizard steps', () => {
    render(
      <FormCreator
        form={{
          id: 'top-level-wizard',
          wizard_steps: [
            { id: 'first', label: 'First', fields: [{ id: 'firstField', type: 'text', label: 'First field' }] },
            { id: 'second', label: 'Second', fields: [{ id: 'secondField', type: 'text', label: 'Second field' }] },
          ],
        }}
      />
    )

    fireEvent.click(screen.getByRole('link', { name: 'Second' }))

    expect(JSON.parse(new URL(window.location.href).searchParams.get('__axiom_form_nav_top-level-wizard') ?? 'null')).toEqual(['second'])
    expect(screen.getByRole('textbox', { name: 'Second field' })).toBeInTheDocument()
  })

  it('updates the URL when navigating top-level tabs', () => {
    render(
      <FormCreator
        form={{
          id: 'top-level-tabs',
          tabs: [
            { id: 'first', label: 'First', fields: [{ id: 'firstField', type: 'text', label: 'First field' }] },
            { id: 'second', label: 'Second', fields: [{ id: 'secondField', type: 'text', label: 'Second field' }] },
          ],
        }}
      />
    )

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Second' }), { button: 0 })

    expect(JSON.parse(new URL(window.location.href).searchParams.get('__axiom_form_nav_top-level-tabs') ?? 'null')).toEqual(['second'])
    expect(screen.getByRole('textbox', { name: 'Second field' })).toBeInTheDocument()
  })

  it('updates the URL for one nested tab level by default', () => {
    render(
      <FormCreator
        form={{
          id: 'nested-navigation',
          settings: { url_navigable: true },
          pages: [
            { id: 'overview', label: 'Overview', fields: [{ id: 'overviewField', type: 'text', label: 'Overview field' }] },
            {
              id: 'details',
              label: 'Details',
              tabs: [
                { id: 'nested-first', label: 'Nested first', fields: [{ id: 'nestedFirstField', type: 'text', label: 'Nested first field' }] },
                { id: 'nested-second', label: 'Nested second', fields: [{ id: 'nestedSecondField', type: 'text', label: 'Nested second field' }] },
              ],
            },
          ],
        }}
      />
    )

    fireEvent.click(screen.getByRole('link', { name: 'Details' }))
    const urlAfterPageChange = window.location.search
    expect(JSON.parse(new URL(window.location.href).searchParams.get('__axiom_form_nav_nested-navigation') ?? 'null')).toEqual(['details'])

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Nested second' }), { button: 0 })

    expect(window.location.search).not.toBe(urlAfterPageChange)
    expect(JSON.parse(new URL(window.location.href).searchParams.get('__axiom_form_nav_nested-navigation') ?? 'null')).toEqual(['details', 'nested-second'])
    expect(screen.getByRole('textbox', { name: 'Nested second field' })).toBeInTheDocument()
  })

  it('uses the form setting to limit URL navigation to top-level layouts', () => {
    render(
      <FormCreator
        form={{
          id: 'depth-zero',
          settings: { url_navigation_depth: 0 },
          pages: [
            { id: 'overview', label: 'Overview', fields: [{ id: 'overviewField', type: 'text', label: 'Overview field' }] },
            {
              id: 'details',
              label: 'Details',
              tabs: [
                { id: 'nested-first', label: 'Nested first', fields: [{ id: 'nestedFirstField', type: 'text', label: 'Nested first field' }] },
                { id: 'nested-second', label: 'Nested second', fields: [{ id: 'nestedSecondField', type: 'text', label: 'Nested second field' }] },
              ],
            },
          ],
        }}
      />
    )

    fireEvent.click(screen.getByRole('link', { name: 'Details' }))
    const urlAfterPageChange = window.location.search
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Nested second' }), { button: 0 })

    expect(window.location.search).toBe(urlAfterPageChange)
    expect(screen.getByRole('textbox', { name: 'Nested second field' })).toBeInTheDocument()
  })

  it('allows the component prop to override the form depth setting', () => {
    render(
      <FormCreator
        urlNavigationDepth={0}
        form={{
          id: 'depth-prop-override',
          settings: { url_navigation_depth: 1 },
          pages: [
            { id: 'overview', label: 'Overview', fields: [{ id: 'overviewField', type: 'text', label: 'Overview field' }] },
            {
              id: 'details',
              label: 'Details',
              tabs: [
                { id: 'nested-first', label: 'Nested first', fields: [{ id: 'nestedFirstField', type: 'text', label: 'Nested first field' }] },
                { id: 'nested-second', label: 'Nested second', fields: [{ id: 'nestedSecondField', type: 'text', label: 'Nested second field' }] },
              ],
            },
          ],
        }}
      />
    )

    fireEvent.click(screen.getByRole('link', { name: 'Details' }))
    const urlAfterPageChange = window.location.search
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Nested second' }), { button: 0 })

    expect(window.location.search).toBe(urlAfterPageChange)
  })

  it('allows the configured depth to enable a second nested layout level', () => {
    const deepForm = {
      id: 'depth-two',
      pages: [{
        id: 'parent',
        label: 'Parent',
        pages: [{
          id: 'middle',
          label: 'Middle',
          pages: [
            { id: 'deep-first', label: 'Deep first', fields: [{ id: 'deepFirstField', type: 'text', label: 'Deep first field' }] },
            { id: 'deep-second', label: 'Deep second', fields: [{ id: 'deepSecondField', type: 'text', label: 'Deep second field' }] },
          ],
        }],
      }],
    } as unknown as IForm

    render(<FormCreator form={deepForm} urlNavigationDepth={2} />)

    fireEvent.click(screen.getByRole('link', { name: 'Parent' }))
    fireEvent.click(screen.getByRole('link', { name: 'Middle' }))
    fireEvent.click(screen.getByRole('link', { name: 'Deep second' }))

    expect(JSON.parse(new URL(window.location.href).searchParams.get('__axiom_form_nav_depth-two') ?? 'null')).toEqual([
      'parent',
      'middle',
      'deep-second',
    ])
    expect(screen.getByRole('textbox', { name: 'Deep second field' })).toBeInTheDocument()
  })

  it('preserves navigation depth through object field layouts', () => {
    render(
      <FormCreator
        form={{
          id: 'object-layout-depth',
          pages: [{
            id: 'parent',
            label: 'Parent',
            fields: [{
              id: 'nestedObject',
              type: 'object',
              fields: [],
              tabs: [
                { id: 'nested-first', label: 'Nested first', fields: [{ id: 'nestedFirstField', type: 'text', label: 'Nested first field' }] },
                { id: 'nested-second', label: 'Nested second', fields: [{ id: 'nestedSecondField', type: 'text', label: 'Nested second field' }] },
              ],
            } as any],
          }],
        }}
      />
    )

    fireEvent.click(screen.getByRole('link', { name: 'Parent' }))
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Nested second' }), { button: 0 })

    expect(JSON.parse(new URL(window.location.href).searchParams.get('__axiom_form_nav_object-layout-depth') ?? 'null')).toEqual([
      'parent',
      'nested-second',
    ])
    expect(screen.getByRole('textbox', { name: 'Nested second field' })).toBeInTheDocument()
  })

  it.each([
    ['page within page', {
      id: 'page-within-page',
      pages: [{
        id: 'parent',
        label: 'Parent',
        pages: [
          { id: 'nested-first', label: 'Nested first', fields: [{ id: 'nestedFirstField', type: 'text', label: 'Nested first field' }] },
          { id: 'nested-second', label: 'Nested second', fields: [{ id: 'nestedSecondField', type: 'text', label: 'Nested second field' }] },
        ],
      }],
    }],
    ['page within wizard', {
      id: 'page-within-wizard',
      wizard_steps: [{
        id: 'parent',
        label: 'Parent',
        pages: [
          { id: 'nested-first', label: 'Nested first', fields: [{ id: 'nestedFirstField', type: 'text', label: 'Nested first field' }] },
          { id: 'nested-second', label: 'Nested second', fields: [{ id: 'nestedSecondField', type: 'text', label: 'Nested second field' }] },
        ],
      }],
    }],
    ['wizard within page', {
      id: 'wizard-within-page',
      pages: [{
        id: 'parent',
        label: 'Parent',
        wizard_steps: [
          { id: 'nested-first', label: 'Nested first', fields: [{ id: 'nestedFirstField', type: 'text', label: 'Nested first field' }] },
          { id: 'nested-second', label: 'Nested second', fields: [{ id: 'nestedSecondField', type: 'text', label: 'Nested second field' }] },
        ],
      }],
    }],
  ] as Array<[string, IForm]>)('supports one nested level for %s', (_name, nestedForm) => {
    render(<FormCreator form={nestedForm} />)

    fireEvent.click(screen.getByRole('link', { name: 'Parent' }))
    fireEvent.click(screen.getByRole('link', { name: 'Nested second' }))

    const url = new URL(window.location.href)
    expect(JSON.parse(url.searchParams.get(`__axiom_form_nav_${nestedForm.id}`) ?? 'null')).toEqual(['parent', 'nested-second'])
    expect(screen.getByRole('textbox', { name: 'Nested second field' })).toBeInTheDocument()
  })
})
