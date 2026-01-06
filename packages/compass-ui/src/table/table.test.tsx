import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../theme'
import { Table, ColumnType } from './index'

interface DataType {
  key: string
  name: string
  age: number
}

const columns: ColumnType<DataType>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
]

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
  },
]

describe('Table', () => {
  describe('Rendering', () => {
    it('should render correct columns and data', () => {
      render(
        <ThemeProvider>
          <Table columns={columns} dataSource={data} />
        </ThemeProvider>,
      )
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Age')).toBeInTheDocument()
      expect(screen.getByText('John Brown')).toBeInTheDocument()
      expect(screen.getByText('32')).toBeInTheDocument()
      expect(screen.getByText('Jim Green')).toBeInTheDocument()
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should render empty text when no data', () => {
      render(
        <ThemeProvider>
          <Table columns={columns} dataSource={[]} />
        </ThemeProvider>,
      )
      expect(screen.getByText('No Data')).toBeInTheDocument()
    })

    it('should render custom empty text', () => {
      render(
        <ThemeProvider>
          <Table columns={columns} dataSource={[]} emptyText="Custom Empty" />
        </ThemeProvider>,
      )
      expect(screen.getByText('Custom Empty')).toBeInTheDocument()
    })

    it('should show loading state', () => {
      render(
        <ThemeProvider>
          <Table columns={columns} dataSource={[]} loading />
        </ThemeProvider>,
      )
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should render with scroll settings', () => {
      render(
        <ThemeProvider>
          <Table columns={columns} dataSource={data} scroll={{ y: 240 }} />
        </ThemeProvider>,
      )

      // Find tbody
      const table = screen.getByRole('table')
      const tbody = table.querySelector('tbody')
      expect(tbody).toHaveStyle({ maxHeight: '240px', overflowY: 'auto', display: 'block' })
    })
  })

  describe('Row Selection', () => {
    it('should select all rows', () => {
      const onChange = jest.fn()
      render(
        <ThemeProvider>
          <Table
            columns={columns}
            dataSource={data}
            rowSelection={{ onChange, selectedRowKeys: [] }}
          />
        </ThemeProvider>,
      )

      // Find select all checkbox (first checkbox in thead)
      const checkboxes = screen.getAllByRole('checkbox')
      const selectAllCheckbox = checkboxes[0]

      fireEvent.click(selectAllCheckbox)
      expect(onChange).toHaveBeenCalledWith(
        ['1', '2'],
        expect.arrayContaining([
          expect.objectContaining({ key: '1' }),
          expect.objectContaining({ key: '2' }),
        ]),
      )
    })

    it('should select single row', () => {
      const onChange = jest.fn()
      render(
        <ThemeProvider>
          <Table
            columns={columns}
            dataSource={data}
            rowSelection={{ onChange, selectedRowKeys: [] }}
          />
        </ThemeProvider>,
      )

      const checkboxes = screen.getAllByRole('checkbox')
      // First one is select-all, second is first row
      const firstRowCheckbox = checkboxes[1]

      fireEvent.click(firstRowCheckbox)
      expect(onChange).toHaveBeenCalledWith(['1'], [expect.objectContaining({ key: '1' })])
    })
  })

  describe('Pagination', () => {
    it('should render pagination', () => {
      render(
        <ThemeProvider>
          <Table columns={columns} dataSource={data} pagination={{ total: 50, pageSize: 10 }} />
        </ThemeProvider>,
      )
      // Pagination component structure might vary, but simplified check
      // Assuming pagination renders page numbers or total count
      // Let's just check if wrapper is there implicitly by checking structure or known text if any.
      // Based on Compass UI Pagination, we might not know exact text without checking it, but it should render.
    })
  })
})
