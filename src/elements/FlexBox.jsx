import { useEffect, useState } from 'react'

const FlexBox = ({
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
        of='none',
        id= 'flexbox-generic',
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
    }) => {

      const [marginx, setMarginx] = useState()
      const [marginy, setMarginy] = useState()

      useEffect(() => {

        let halfx = mx / 2
        let halfy = my / 2

        setMarginx(`${halfx}px`)
        setMarginy(`${halfy}px`)

      }, [mx, my])

  return (



    <div id={id} className='flexBox' 
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
              fw: fw
          }}>
          {children}
    </div>
  )
}

export default FlexBox
