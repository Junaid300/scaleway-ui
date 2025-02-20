import { fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagInput } from '..'
import { shouldMatchEmotionSnapshot } from '../../../../.jest/helpers'

const mockOnClick = jest.fn()

describe('TagInput', () => {
  test('renders correctly with base props', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        name="radio"
        onChangeError={() => {}}
        placeholder="TagInput..."
      />,
    ))

  test('renders correctly with some tags', () =>
    shouldMatchEmotionSnapshot(
      <TagInput onChange={() => {}} name="radio" tags={['hello', 'world']} />,
    ))

  test('renders correctly with some tags objects', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        onChange={() => {}}
        name="radio"
        tags={[
          { index: 'index', label: 'hello' },
          { index: 'secondIndex', label: 'world' },
        ]}
      />,
    ))

  test('renders correctly with some tags', () =>
    shouldMatchEmotionSnapshot(
      <TagInput onChange={() => {}} name="radio" tags={['hello', 'world']} />,
    ))

  test('renders correctly with some tags as objects', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        onChange={() => {}}
        name="radio"
        tags={[
          { index: 'index', label: 'hello' },
          { index: 'secondIndex', label: 'world' },
        ]}
      />,
    ))

  test('renders correctly when variant = bordered', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        onChange={() => {}}
        name="radio"
        tags={['hello', 'world']}
        variant="bordered"
      />,
    ))

  test('renders correctly when variant = base', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        onChange={() => {}}
        name="radio"
        tags={['hello', 'world']}
        variant="base"
      />,
    ))

  test('renders correctly when variant = no-border', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        onChange={() => {}}
        name="radio"
        tags={['hello', 'world']}
        variant="no-border"
      />,
    ))

  test('renders correctly when manualInput is disabled', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        onChange={() => {}}
        name="radio"
        tags={['hello', 'world']}
        manualInput={false}
      />,
    ))

  test('renders correctly when disabled', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        onChange={() => {}}
        name="radio"
        tags={['hello', 'world']}
        disabled
      />,
    ))

  test('delete tag', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        id="test"
        onChange={() => {}}
        name="radio"
        tags={['hello', 'world']}
      />,
      {
        transform: async node => {
          const input = node.getByDisplayValue('')
          expect(input).toBeInTheDocument()
          const HelloTag = node.queryByText(/hello/)
          expect(HelloTag).toBeInTheDocument()

          // remove Tag
          const tagClose = HelloTag?.nextElementSibling as HTMLButtonElement
          await userEvent.click(tagClose)

          // check Tag was removed
          expect(HelloTag).not.toBeInTheDocument()
        },
      },
    ))
  test('delete tag with error', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        id="test"
        onChange={() => {
          throw new Error('Not Working')
        }}
        onChangeError={e => e}
        name="radio"
        tags={['throw', 'error']}
      />,
      {
        transform: async node => {
          const input = node.getByDisplayValue('')
          expect(input).toBeInTheDocument()
          const ErrorTag = node.queryByText(/error/)
          expect(ErrorTag).toBeInTheDocument()

          // remove Tag
          const tagClose = ErrorTag?.nextElementSibling as HTMLButtonElement
          await userEvent.click(tagClose)
        },
      },
    ))

  test('add tag from input', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        id="test"
        onChange={mockOnClick}
        name="radio"
        tags={['hello', 'world']}
      />,
      {
        transform: async ({ getByDisplayValue, getByText }) => {
          const input = getByDisplayValue('') as HTMLInputElement
          await userEvent.type(input, 'test{enter}')
          await waitFor(() => expect(input.value).toBe(''))
          expect(getByText('test')).toBeInTheDocument()
        },
      },
    ))

  test('add tag from input with error', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        id="test"
        onChange={() => {
          throw new Error('Not Working')
        }}
        onChangeError={e => e}
        name="radio"
        tags={['hello', 'world']}
      />,
      {
        transform: async ({ getByDisplayValue }) => {
          const input = getByDisplayValue('') as HTMLInputElement
          await userEvent.type(input, 'test{enter}')
          await waitFor(() => expect(input.value).toBe(''))
        },
      },
    ))

  test('delete tag with backspace', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        id="test"
        onChange={() => {}}
        name="radio"
        tags={['hello', 'world']}
      />,
      {
        transform: async ({ getByDisplayValue, queryByText }) => {
          const input = getByDisplayValue('')
          const LastTag = queryByText(/world/)
          expect(LastTag).toBeInTheDocument()
          await userEvent.click(input)
          expect(input).toHaveFocus()
          await userEvent.keyboard('{backspace}')
          expect(LastTag).not.toBeInTheDocument()
        },
      },
    ))

  test('add tag on paste', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        id="test"
        onChange={() => {}}
        name="radio"
        tags={['hello', 'world']}
      />,
      {
        transform: async ({ getByDisplayValue, getByText }) => {
          const input = getByDisplayValue('') as HTMLInputElement
          fireEvent.paste(input, {
            clipboardData: { getData: () => 'test' },
          })
          await waitFor(() => expect(input.value).toBe(''))
          await waitFor(() => getByText('test'))
        },
      },
    ))
  test('add tag on paste with error', () =>
    shouldMatchEmotionSnapshot(
      <TagInput
        id="test"
        onChange={() => {
          throw new Error('Not Working')
        }}
        onChangeError={e => e}
        name="radio"
        tags={['hello', 'world']}
      />,
      {
        transform: ({ getByDisplayValue }) => {
          const input = getByDisplayValue('') as HTMLInputElement
          fireEvent.paste(input, {
            clipboardData: { getData: () => 'test' },
          })
        },
      },
    ))
})
