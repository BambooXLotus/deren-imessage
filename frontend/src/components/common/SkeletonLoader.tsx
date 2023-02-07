import {Skeleton} from '@chakra-ui/react'
import React from 'react'

interface SkeletonLoaderProps {
  count: number
  height: string
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({count, height}) => {
  return (
    <>
      {/* TODO: DO SOMETHING HERE BETTER */}
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          startColor="blackAlpha.400"
          endColor="whiteAlpha.300"
          height={height}
          width="full"
          borderRadius={4}
        />
      ))}
    </>
  )
}
export default SkeletonLoader
