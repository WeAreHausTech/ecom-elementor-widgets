import { searchChannel } from '@/eventbus/channels/search-channel'
import { CustomHTMLElement } from '@/types'
import { debounce } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
export interface SearchProductsProps extends CustomHTMLElement {
  children: (props: {
    term: string
    setTerm: (value: string) => void
    clear: () => void
  }) => React.ReactNode
}
export const SearchProducts = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: SearchProductsProps) => {
  const [term, setTerm] = useState<string>('')

  const clear = () => {
    setTerm('')
    searchChannel.emit('search:clear')
  }

  const debouncedEmitter = useMemo(() => 
    debounce((term) => {
      if (term) {
        searchChannel.emit('search:term', term)
      }
    }, 500),
    [],
  )

  useEffect(() => {
    debouncedEmitter(term)
  }, [term, debouncedEmitter])
  
  return (
    <Wrapper {...rest}>
      {children({
        term,
        setTerm,
        clear,
      })}
    </Wrapper>
  )
}
