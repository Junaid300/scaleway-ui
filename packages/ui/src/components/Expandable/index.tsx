import styled from '@emotion/styled'
import type { ReactNode } from 'react'

type ExpandableProps = {
  /**
   * The content to display
   */
  children: ReactNode
  /**
   * The maxHeight of the content to make the opening and closing animation
   */
  height?: number
  /**
   * To display or not the content
   */
  opened?: boolean
}

export const Expandable = styled('div', {
  shouldForwardProp: prop => !['opened', 'height'].includes(prop),
})<ExpandableProps>`
  transition: max-height 300ms ease-out, opacity 300ms ease-out;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  height: auto;
  margin-top: 0;

  ${({ opened = false, height = 5000 }) =>
    opened &&
    `
    transition: max-height 300ms ease-in, opacity 300ms ease-in;
    max-height: ${height}px;
    opacity: 1;
    overflow: visible;
  `}
`
