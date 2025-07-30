import { useEffect, useState, forwardRef } from 'react'

const FlexBox = forwardRef(({
  children, 
  w='auto', 
  h='auto', 
  jc='center', 
  ai='center', 
  dir='column',
  bg='white',
  mx='0',
  my='0',
  bo='',
  id= 'flexbox-generic',
  cl='',
  ox='none',
  oy='none',
  cs='',
  drg=false,
  br=0,
  bx='none',
  fw='',
  onClick,
  onDragStart,
  onDrop,
  onDragOver,
  st = {}
}, ref) => {

  const [marginx, setMarginx] = useState()
  const [marginy, setMarginy] = useState()

  useEffect(() => {
    const halfx = mx / 2
    const halfy = my / 2
    setMarginx(`${halfx}px`)
    setMarginy(`${halfy}px`)
  }, [mx, my])

  return (
    <div
      ref={ref} // ✅ THIS IS THE CRITICAL FIX
      id={id}
      className={`flexBox${cl ? ` ${cl}` : ''}`}
      draggable={drg}
      onClick={onClick}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        width: w,
        height: h,
        display: 'flex',
        justifyContent: jc,
        alignItems: ai,
        flexDirection: dir,
        backgroundColor: bg,
        marginTop: marginy,
        marginBottom: marginy,
        marginLeft: marginx,
        marginRight: marginx,
        border: bo,
        overflowY: oy,
        overflowX: ox,
        cursor: cs,
        borderRadius: `${br}px`,
        boxShadow: bx,
        fontWeight: fw,
        ...st
      }}
    >
      {children}
    </div>
  )
})

export default FlexBox
