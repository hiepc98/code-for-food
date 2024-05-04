// import React from 'react'

const useViewport = () => {
  const mainUrl = new URL(window.location.href)
  const isExpand =
    mainUrl.searchParams.get('expand') ||
    window.location.href.includes('welcome')
  return {
    isExpand
  }
}

export default useViewport
