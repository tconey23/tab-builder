import React from 'react'

const Button = ({children, clk, ref, st={}}) => {
  return (
    <button style={{...st}} ref={ref} onClick={clk} type='button'>{children}</button>
  )
}

export default Button
