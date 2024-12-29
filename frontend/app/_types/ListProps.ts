// If items are of type T, we render a layout of type T
import { Identifiable } from '@/types'

// We require items to have an id to ensure mapping can work with them
export type ListProps<T extends Identifiable> = {
  items: T[]
  // We require passing an item, but don't need to specify the key used as prop to map
  // as react does not pass the key to the layout component
  Layout: React.ComponentType<{ item: T; layoutClassName?: string }>
  styles?: React.CSSProperties
  className?: string
  layoutClassName?: string
}
