import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import QCToolsForm from './QCTools'

vi.mock('@/Form/FormWithEditorOverlay', () => ({
  FormWithEditorOverlay: ({ inputOverrides }: any) => {
    const QCField = inputOverrides['custom:qc-tools']

    return (
      <QCField
        field={{ id: 'qc-tools-field', type: 'custom:qc-tools', label: '' }}
        value={undefined}
        onChange={vi.fn()}
      />
    )
  },
}))

vi.mock('@axdspub/axiom-ui-utilities', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Loader: () => <span data-testid="loader" />,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  utils: {
    createButtonClass: () => 'button',
  },
}))

describe('QCToolsForm file sizes', () => {
  it('shows per-file sizes and total and mean sizes above validation', async () => {
    const largerFile = new File([new Uint8Array(1536)], 'larger.txt', { type: 'text/plain' })
    const smallerFile = new File([new Uint8Array(512)], 'smaller.txt', { type: 'text/plain' })
    const { container } = render(<QCToolsForm />)
    const fileInput = container.querySelector('input[type="file"]')

    expect(fileInput).not.toBeNull()
    fireEvent.change(fileInput as HTMLInputElement, {
      target: { files: [largerFile, smallerFile] },
    })

    await waitFor(() => {
      expect(screen.getByText('2.0 KB')).toBeInTheDocument()
      expect(screen.getByText('1.0 KB')).toBeInTheDocument()
      expect(screen.getByText('1.5 KB')).toBeInTheDocument()
      expect(screen.getByText('512 B')).toBeInTheDocument()
    })

    expect(screen.getByText('Total file size')).toBeInTheDocument()
    expect(screen.getByText('Mean file size')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Size' })).toBeInTheDocument()
    expect(screen.getByText('Validation Overview').compareDocumentPosition(screen.getByText('Total file size')) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
  })
})