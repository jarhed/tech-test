import { useEffect, useState, useRef } from 'react'

export function DashPlayer ({ url }: { url: string}) {

  const [readyToPlay, setReadyToPlay] = useState(false)
  const ref = useRef<HTMLVideoElement>(null!)

  useEffect(() => {
    const initDashPlayer = async () => {

      const { MediaPlayer } = await import('dashjs')
      const player = MediaPlayer().create()
      
      player.initialize(ref.current, url, true)
      player.on(MediaPlayer.events['REPRESENTATION_SWITCH'], (event) => {
        const streamInfo = player.getActiveStream()!.getStreamInfo()
        const dashMetrics = player.getDashMetrics()
        const dashAdapter = player.getDashAdapter()
        // @ts-ignore
        var repSwitch = dashMetrics.getCurrentRepresentationSwitch('video', true);
        const periodIdx = streamInfo!.index
        // @ts-ignore
        const bitrate = repSwitch ? Math.round(dashAdapter.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000) : NaN;
        // @ts-ignore
        const adaptation = dashAdapter.getAdaptationForType(periodIdx, 'video', streamInfo);
        // @ts-ignore
        const currentRep = adaptation.Representation_asArray.find((rep) => {
        // @ts-ignore
            return rep.id === repSwitch.to
        })
        const frameRate = currentRep.frameRate;
        const resolution = currentRep.width + 'x' + currentRep.height;

        let meta_data = {
          bitrate,
          currentRep,
          resolution,
          frameRate
        }

        setReadyToPlay(true)
        fetch('/api/meta', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              filename: url,
              meta_data
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

