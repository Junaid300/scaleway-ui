import styled from '@emotion/styled'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { fadeIn } from '../../utils'

const HEIGHT = 56
const SPACING = 20

const StyledDiv = styled.div<{ rank: number }>`
  background: ${({ theme }) => theme.colors.neutral.backgroundWeakElevated};
  border: 1px solid ${({ theme }) => theme.colors.neutral.border};
  border-radius: ${({ theme }) => theme.radii.default};
  bottom: ${({ rank }) => SPACING + rank * (HEIGHT + SPACING)}px;
  box-shadow: ${({ theme }) => theme.shadows.defaultShadow};
  height: ${HEIGHT}px;
  left: 50%;
  position: fixed;
  transform: translate(-50%, 0);
  width: 600px;
  animation: ${fadeIn} 0.2s ease-in-out;
`

type ActionBarProps = {
  children: ReactNode
  /**
   * The position of the bar (start at 0)
   */
  rank?: number
  role?: string
  'aria-modal'?: 'true' | 'false'
  className?: string
}

export const ActionBar = ({
  children,
  role,
  rank = 0,
  'aria-modal': ariaModal,
  className,
}: ActionBarProps) =>
  createPortal(
    <StyledDiv
      rank={rank}
      role={role}
      aria-modal={ariaModal}
      className={className}
    >
      {children}
    </StyledDiv>,
    document.body,
  )
