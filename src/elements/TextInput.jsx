import React from 'react'

const TextInput = ({onChange, v}) => {

  return (
    <input onChange={onChange} value={v} type='text'/>
  )
}

export default TextInput
