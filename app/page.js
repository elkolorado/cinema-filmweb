import Image from 'next/image'
import styles from './page.module.css'
import Movies from './movies'
export default function Home() {
  return (
    <main>
      <div className="">
        {/* <Movies /> */}
        <iframe id="frame" src="SQL.pdf"></iframe>
      </div>
    </main>
  )
}
