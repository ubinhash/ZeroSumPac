import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>Title</title>
      </Head>
      <div>intro</div>
    </Layout>
  )
}
