import React from 'react'

/**
 * Responsive image with explicit dimensions (reduces CLS) and lazy loading by default.
 */
const OptimizedImage = ({
  src,
  srcSet,
  alt = '',
  className = '',
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  ...rest
}) => {
  if (!src) return null

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      className={className}
      {...rest}
    />
  )
}

export default OptimizedImage
