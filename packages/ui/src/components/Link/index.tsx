import styled from '@emotion/styled'
import type {
  AnchorHTMLAttributes,
  ForwardedRef,
  HTMLAttributeAnchorTarget,
  MouseEventHandler,
  ReactNode,
  RefObject,
} from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import recursivelyGetChildrenString from '../../helpers/recursivelyGetChildrenString'
import type { Color } from '../../theme'
import { Icon } from '../Icon'
import { Tooltip } from '../Tooltip'

const StyledIcon = styled(Icon)``

type LinkSizes = 'large' | 'small'
type LinkIconPosition = 'left' | 'right'
type LinkProps = {
  children: ReactNode
  target?: HTMLAttributeAnchorTarget
  download?: string | boolean
  variant?: Color
  size?: LinkSizes
  iconPosition?: LinkIconPosition
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>['rel']
  className?: string
  href: string
  // For react router shouldn't be used directly
  onClick?: MouseEventHandler<HTMLAnchorElement>
  'aria-label'?: string
  oneLine?: boolean
}

const ICON_SIZE = 16
const BLANK_TARGET_ICON_SIZE = 14
const TRANSITION_DURATION = 250

const StyledExternalIconContainer = styled.span`
  display: inline-flex;
  padding-bottom: ${({ theme }) => theme.space['0.5']};
`

export const StyledLink = styled('a', {
  shouldForwardProp: prop =>
    !['variant', 'iconPosition', 'as', 'oneLine'].includes(prop),
})<{
  variant: Color
  size: LinkSizes
  iconPosition?: LinkIconPosition
  oneLine?: boolean
}>`
  background-color: transparent;
  border: none;
  padding: 0;
  color: ${({ theme, variant }) =>
    theme.colors[variant]?.text ?? theme.colors.neutral.text};
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  text-decoration-color: transparent;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  transition: text-decoration-color ${TRANSITION_DURATION}ms ease-out;

  ${StyledIcon} {
    transition: transform ${TRANSITION_DURATION}ms ease-out;
  }

  gap: ${({ theme }) => theme.space['1']};
  position: relative;
  cursor: pointer;

  > * {
    // Safari issue when something is inside an anchor
    pointer-events: none;
  }

  ${({ oneLine }) =>
    oneLine
      ? `white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;`
      : 'width: fit-content;'}

  ${({ size, theme }) => {
    const variant = size === 'small' ? 'bodySmallStrong' : 'bodyStrong'

    return `
      font-size: ${theme.typography[variant].fontSize};
      font-family: ${theme.typography[variant].fontFamily};
      font-weight: ${theme.typography[variant].weight};
      letter-spacing: ${theme.typography[variant].letterSpacing};
      line-height: ${theme.typography[variant].lineHeight};
      paragraph-spacing: ${theme.typography[variant].paragraphSpacing};
      text-case: ${theme.typography[variant].textCase};
    `
  }}
  &:hover,
  &:focus {
    ${StyledIcon} {
      transform: ${({ theme, iconPosition }) =>
        iconPosition === 'left'
          ? `translate(${theme.space['0.5']}, 0)`
          : `translate(-${theme.space['0.5']}, 0)`};
    }

    outline: none;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    color: ${({ theme, variant }) =>
      theme.colors[variant]?.text ?? theme.colors.neutral.text};
    text-decoration-color: ${({ theme, variant }) =>
      theme.colors[variant]?.text ?? theme.colors.neutral.text};
  }

  &:hover::after,
  &:focus::after {
    background-color: ${({ theme, variant }) =>
      theme.colors[variant]?.text ?? theme.colors.neutral.text};
  }

  &:active {
    text-decoration-thickness: 2px;
  }
`

export const Link = forwardRef(
  (
    {
      children,
      href,
      target,
      download,
      variant = 'info',
      size = 'large',
      iconPosition,
      rel,
      className,
      onClick,
      'aria-label': ariaLabel,
      oneLine = false,
    }: LinkProps,
    ref: ForwardedRef<HTMLAnchorElement>,
  ) => {
    const isBlank = target === '_blank'
    const computedRel = rel || (isBlank ? 'noopener noreferrer' : undefined)
    const [isTruncated, setIsTruncated] = useState(false)
    const elementRef = useRef<HTMLAnchorElement>(null)

    const usedRef = (ref as RefObject<HTMLAnchorElement>) ?? elementRef

    const finalStringChildren = recursivelyGetChildrenString(children)

    useEffect(() => {
      if (oneLine && usedRef && usedRef.current) {
        const { offsetWidth, scrollWidth } = usedRef.current
        setIsTruncated(offsetWidth < scrollWidth)
      }
    }, [oneLine, ref, usedRef])

    return (
      <Tooltip text={oneLine && isTruncated ? finalStringChildren : ''}>
        <StyledLink
          href={href}
          target={target}
          download={download}
          ref={usedRef}
          variant={variant}
          rel={computedRel}
          className={className}
          size={size}
          onClick={onClick}
          iconPosition={iconPosition}
          aria-label={ariaLabel}
          oneLine={oneLine}
        >
          {!isBlank && iconPosition === 'left' ? (
            <StyledIcon name="arrow-left" size={ICON_SIZE} />
          ) : null}
          {children}

          {isBlank ? (
            <StyledExternalIconContainer>
              <StyledIcon name="open-in-new" size={BLANK_TARGET_ICON_SIZE} />
            </StyledExternalIconContainer>
          ) : null}

          {!isBlank && iconPosition === 'right' ? (
            <StyledIcon name="arrow-right" size={ICON_SIZE} />
          ) : null}
        </StyledLink>
      </Tooltip>
    )
  },
)
