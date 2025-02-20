import styled from '@emotion/styled'
import type { ForwardedRef, ReactNode } from 'react'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Loader } from '../Loader'
import getPageNumbers from './getPageNumbers'
import type { UsePaginationReturn } from './usePagination'
import { usePagination } from './usePagination'

export type PaginationState<T> = {
  canLoadMore: boolean
  data?: T[] | null
} & UsePaginationReturn<T>

const PaginationContext = createContext<PaginationState<unknown> | undefined>(
  undefined,
)

export const usePaginationContext = <T,>(): PaginationState<T> =>
  useContext(PaginationContext) as PaginationState<T>

// START - Default Components
const DefaultLeftComponent = () => null

const PageNumbersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space['2']};
  margin: 0 ${({ theme }) => theme.space['2']};
`

const StyledPageSwitch = styled(Button)`
  width: ${({ theme }) => theme.space['4']};
  height: ${({ theme }) => theme.space['6']};
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageSwitchContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space['1']};
`

const StyledPageButton = styled('button', {
  shouldForwardProp: prop => !['current'].includes(prop),
})<{ current?: boolean }>`
  color: ${({ theme }) => theme.colors.neutral.textStrong};
  line-height: ${({ theme }) => theme.space['3']};
  width: ${({ theme }) => theme.space['6']};
  height: ${({ theme }) => theme.space['6']};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.neutral.background};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.default};

  &[aria-current='true'] {
    color: ${({ theme }) => theme.colors.primary.text};
    border-color: ${({ theme }) => theme.colors.primary.borderWeak};
  }

  &[aria-current='false']:hover {
    color: ${({ theme }) => theme.colors.primary.textWeak};
    border-color: ${({ theme }) => theme.colors.neutral.borderStrong};
  }
`

export type PaginationComponentProps<T> = {
  // eslint-disable-next-line react/no-unused-prop-types
  className?: string
  // eslint-disable-next-line react/no-unused-prop-types
  pageTabCount?: number
  paginationState: PaginationState<T>
}

function DefaultMiddleComponent<T>({
  pageTabCount,
  paginationState,
}: PaginationComponentProps<T>): JSX.Element {
  const {
    isLoadingPage,
    page,
    maxPage,
    canLoadMore,
    goToNextPage,
    goToFirstPage,
    goToLastPage,
    goToPage,
    goToPreviousPage,
  } = paginationState

  const pageNumbersToDisplay = useMemo(
    () => (maxPage > 1 ? getPageNumbers(page, maxPage, pageTabCount) : [1]),
    [page, maxPage, pageTabCount],
  )

  const handlePageClick = useCallback(
    (pageNumber: number) => () => {
      goToPage(pageNumber)
    },
    [goToPage],
  )

  return (
    <div style={{ display: 'flex' }}>
      <PageSwitchContainer>
        <StyledPageSwitch
          aria-label="First"
          disabled={page === 1 || isLoadingPage}
          variant="primary-bordered"
          onClick={goToFirstPage}
        >
          <div>
            <Icon name="arrow-left-double" />
          </div>
        </StyledPageSwitch>
        <StyledPageSwitch
          aria-label="Back"
          disabled={page === 1 || isLoadingPage}
          variant="primary-bordered"
          onClick={goToPreviousPage}
        >
          <div>
            <Icon name="arrow-left" />
          </div>
        </StyledPageSwitch>
      </PageSwitchContainer>
      <PageNumbersContainer>
        {pageNumbersToDisplay.map(pageNumber => (
          <StyledPageButton
            aria-label={`Page ${pageNumber}`}
            key={`pagination-page-${pageNumber}`}
            disabled={isLoadingPage}
            aria-current={pageNumber === page}
            onClick={handlePageClick(pageNumber)}
          >
            {pageNumber}
          </StyledPageButton>
        ))}
      </PageNumbersContainer>
      <PageSwitchContainer>
        <StyledPageSwitch
          aria-label="Next"
          disabled={(page === maxPage && !canLoadMore) || isLoadingPage}
          variant="primary-bordered"
          onClick={goToNextPage}
        >
          <div>
            <Icon name="arrow-right" />
          </div>
        </StyledPageSwitch>
        <StyledPageSwitch
          aria-label="Last"
          disabled={page === maxPage || isLoadingPage}
          variant="primary-bordered"
          onClick={goToLastPage}
        >
          <div>
            <Icon name="arrow-right-double" />
          </div>
        </StyledPageSwitch>
      </PageSwitchContainer>
    </div>
  )
}

function DefaultRightComponent<T>({
  paginationState: { page },
}: PaginationComponentProps<T>): JSX.Element {
  return <div>Current : {page}</div>
}

const StyledActivityContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${({ theme }) => `${theme.space['2']} 0`};
`

const DefaultLoaderComponent = () => (
  <StyledActivityContainer>
    <Loader active />
  </StyledActivityContainer>
)

const StyledMainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  justify-content: space-between;
`

const StyledLeftContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
const StyledMiddleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const StyledRightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

type PaginationContainerProps<T> = PaginationComponentProps<T> & {
  RightComponent?:
    | ((props: PaginationComponentProps<T>) => JSX.Element | null)
    | (() => JSX.Element | null)
  LeftComponent?:
    | ((props: PaginationComponentProps<T>) => JSX.Element | null)
    | (() => JSX.Element | null)
  MiddleComponent?:
    | ((props: PaginationComponentProps<T>) => JSX.Element | null)
    | (() => JSX.Element | null)
}

const PaginationContainer = ({
  LeftComponent = DefaultLeftComponent,
  MiddleComponent = DefaultMiddleComponent,
  RightComponent = DefaultRightComponent,
  paginationState,
  pageTabCount = 5,
  className,
}: PaginationContainerProps<unknown>) => (
  <StyledMainContainer role="navigation" className={className}>
    <StyledLeftContainer>
      <LeftComponent
        paginationState={paginationState}
        pageTabCount={pageTabCount}
      />
    </StyledLeftContainer>
    <StyledMiddleContainer>
      <MiddleComponent
        paginationState={paginationState}
        pageTabCount={pageTabCount}
      />
    </StyledMiddleContainer>
    <StyledRightContainer>
      <RightComponent
        paginationState={paginationState}
        pageTabCount={pageTabCount}
      />
    </StyledRightContainer>
  </StyledMainContainer>
)

// END - Default Components

export type PaginationProps<T> = {
  onLoadPage?: (params: {
    page: number
    perPage?: number
  }) => Promise<void | T | T[]>
  onChangePage?: (newPage: number) => void
  perPage?: number
  data?: T[]
  initialData?: T[]
  initialPage?: number
  page?: number
  pageCount?: number
  RightComponent?: (props: PaginationComponentProps<T>) => JSX.Element | null
  LeftComponent?: (props: PaginationComponentProps<T>) => JSX.Element | null
  MiddleComponent?: (props: PaginationComponentProps<T>) => JSX.Element | null
  LoaderComponent?: (props: PaginationComponentProps<T>) => JSX.Element | null
  children: ReactNode | ((props: PaginationState<T>) => ReactNode)
  /**
   * Number of page buttons you want for the default MiddleComponent
   */
  pageTabCount?: number
}

function FwdPagination<T>(
  {
    children,
    data: dataProp,
    initialData = [],
    initialPage = 1,
    page: pageProp,
    pageCount,
    onLoadPage,
    onChangePage,
    perPage: perPageProp = 25,
    LeftComponent = DefaultLeftComponent,
    MiddleComponent = DefaultMiddleComponent,
    RightComponent = DefaultRightComponent,
    LoaderComponent = DefaultLoaderComponent,
    pageTabCount = 5,
  }: PaginationProps<T>,
  ref: ForwardedRef<PaginationState<T>>,
): JSX.Element {
  const paginationRef = useRef<PaginationState<T>>({} as PaginationState<T>)
  useImperativeHandle(ref, () => paginationRef.current)

  const [page, setPage] = useState(pageProp ?? initialPage)
  const [data, setData] = useState(dataProp ?? initialData)
  const onChangePageRef = useRef(onChangePage)
  const onLoadPageRef = useRef(onLoadPage)

  const handleLoadPage = useCallback(
    async ({
      page: currentPage,
      perPage,
    }: {
      page: number
      perPage?: number
    }) => {
      const res = (await onLoadPageRef.current?.({
        page: currentPage,
        perPage,
      })) as []
      if (res?.length > 0) {
        paginationRef.current.setPageData(currentPage, res)
      }
    },
    [],
  )

  const handleChangePage = useCallback((newPage: number) => {
    if (onChangePageRef.current) {
      onChangePageRef.current(newPage)
    } else {
      setPage(newPage)
    }
  }, [])

  const {
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPage,
    goToPreviousPage,
    maxPage,
    page: currentPage,
    pageData,
    paginatedData,
    isLoadingPage,
    perPage,
    reloadPage,
    setPageData,
    setPaginatedData,
  } = usePagination({
    data,
    onChangePage: handleChangePage,
    onLoadPage: onLoadPage ? handleLoadPage : undefined,
    page,
    pageCount,
    perPage: perPageProp,
  })

  useEffect(() => {
    if (pageProp && pageProp !== page) {
      setPage(pageProp)
    }
  }, [pageProp, page])

  useEffect(() => {
    if (dataProp) {
      setData(dataProp)
    }
  }, [dataProp])

  const value = useMemo(() => {
    paginationRef.current = {
      canLoadMore: onLoadPageRef.current !== undefined,
      data: dataProp,
      goToFirstPage,
      goToLastPage,
      goToNextPage,
      goToPage,
      goToPreviousPage,
      isLoadingPage,
      maxPage,
      page: currentPage,
      pageData,
      paginatedData,
      perPage,
      reloadPage,
      setPageData,
      setPaginatedData,
    }

    return paginationRef.current
  }, [
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPage,
    goToPreviousPage,
    isLoadingPage,
    dataProp,
    maxPage,
    currentPage,
    pageData,
    paginatedData,
    perPage,
    reloadPage,
    setPageData,
    setPaginatedData,
  ])

  useEffect(() => {
    onLoadPageRef.current = onLoadPage
  }, [onLoadPage])

  useEffect(() => {
    onChangePageRef.current = onChangePage
  }, [onChangePage])

  const TypedPaginationContainer = PaginationContainer as (
    props: PaginationContainerProps<T>,
  ) => JSX.Element

  return (
    // @ts-expect-error we force cast the generic context
    <PaginationContext.Provider value={value}>
      {isLoadingPage ? (
        <LoaderComponent paginationState={value} pageTabCount={pageTabCount} />
      ) : null}
      {children && typeof children === 'function' && !isLoadingPage
        ? children(value)
        : null}
      {children && typeof children !== 'function' && !isLoadingPage
        ? children
        : null}
      <TypedPaginationContainer
        paginationState={value}
        pageTabCount={pageTabCount}
        LeftComponent={LeftComponent}
        RightComponent={RightComponent}
        MiddleComponent={MiddleComponent}
      />
    </PaginationContext.Provider>
  )
}

/**
 * @deprecated Use PaginationV2 instead
 */
// @ts-expect-error it breaks on I don't know what
export const Pagination = forwardRef(FwdPagination) as (<T>(
  props: PaginationProps<T> & { ref?: ForwardedRef<PaginationState<T>> },
) => ReturnType<typeof FwdPagination>) & {
  RightComponent: (
    props: PaginationComponentProps<unknown>,
  ) => JSX.Element | null
  LeftComponent: (
    props: PaginationComponentProps<unknown>,
  ) => JSX.Element | null
  PaginationContainer: (
    props: PaginationComponentProps<unknown>,
  ) => JSX.Element | null
  MiddleComponent: (
    props: PaginationComponentProps<unknown>,
  ) => JSX.Element | null
  LoaderComponent: (
    props: PaginationComponentProps<unknown>,
  ) => JSX.Element | null
}

Pagination.LeftComponent = DefaultLeftComponent
Pagination.LoaderComponent = DefaultLoaderComponent
Pagination.MiddleComponent = DefaultMiddleComponent
Pagination.PaginationContainer = PaginationContainer
Pagination.RightComponent = DefaultRightComponent
