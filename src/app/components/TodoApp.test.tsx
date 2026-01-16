import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TodoApp from './TodoApp'

describe('TodoApp', () => {
  it('初期状態では空のタスクリストメッセージが表示される', () => {
    render(<TodoApp />)
    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
  })

  it('新しいタスクを追加できる', () => {
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: 'テストタスク' } })
    fireEvent.click(addButton)

    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.queryByText('No tasks yet. Add one above!')).not.toBeInTheDocument()
  })

  it('Enterキーでタスクを追加できる', () => {
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('Add a new task...')

    fireEvent.change(input, { target: { value: 'Enterで追加' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.getByText('Enterで追加')).toBeInTheDocument()
  })

  it('空の入力ではタスクを追加できない', () => {
    render(<TodoApp />)

    const addButton = screen.getByRole('button', { name: 'Add' })
    fireEvent.click(addButton)

    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
  })

  it('空白のみの入力ではタスクを追加できない', () => {
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(addButton)

    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
  })

  it('タスクの完了状態をトグルできる', () => {
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: 'トグルテスト' } })
    fireEvent.click(addButton)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('タスクを削除できる', () => {
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: '削除テスト' } })
    fireEvent.click(addButton)

    expect(screen.getByText('削除テスト')).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButton)

    expect(screen.queryByText('削除テスト')).not.toBeInTheDocument()
    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
  })

  it('残りタスク数が正しく表示される', () => {
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    // 2つのタスクを追加
    fireEvent.change(input, { target: { value: 'タスク1' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'タスク2' } })
    fireEvent.click(addButton)

    expect(screen.getByText('2 task(s) remaining')).toBeInTheDocument()

    // 1つを完了にする
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    expect(screen.getByText('1 task(s) remaining')).toBeInTheDocument()
  })

  it('タスク追加後に入力フィールドがクリアされる', () => {
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: 'クリアテスト' } })
    fireEvent.click(addButton)

    expect(input.value).toBe('')
  })
})
