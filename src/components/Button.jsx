import React from 'react'

const Button = ({children, clk, ref}) => {
  return (
    <button ref={ref} onClick={clk} type='button'>{children}</button>
  )
}

export default Button
