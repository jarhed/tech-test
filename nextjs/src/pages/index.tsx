import Image from 'next/image'
import { Inter } from 'next/font/google'
import { DashPlayer } from '../components/DashPlayer'

const inter = Inter({ subsets: ['latin'] })

const testURL = `https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd`

export default function Home() {
  return (
    <main
      className={`flex min-h-screen w-full flex-col items-center justify-center ${inter.className}`}
    >
      <DashPlayer url={testURL} />
    </main>
  )
}
