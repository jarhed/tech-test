import { useEffect, useState, useRef } from 'react'

export function DashPlayer ({ url }: { url: string}) {

  const [readyToPlay, setReadyToPlay] = useState(false)
  const ref = useRef<HTMLVideoElement>(null!)

  useEffect(() => {
    const initDashPlayer = async () => {

      const { MediaPlayer } = await import('dashjs')
      const player = MediaPlayer().create()
      
      player.initialize(ref.current, url, true)
      player.on(MediaPlayer.events['CAN_PLAY'], (event) => {
        setReadyToPlay(true)
        fetch('/api/meta', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              filename: url
            }),
          })
      })

    }
    initDashPlayer()
  }, [url])

  return (
    <div className={`flex w-full justify-center items-center`}>
      <video
        autoPlay={ true }
        controls={ true }
        ref={ ref }
        src={ url } 
        className={`w-full h-auto xl:w-2/3 xl:rounded-md transition-all ${ !readyToPlay ? 'hidden' : ''  }`}>
      </video>
      { !readyToPlay ? <p className="text-2xl text-white font-bold">Loading...</p> : null }
    </div>
  )

}

