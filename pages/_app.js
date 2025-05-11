// pages/_app.js
import * as React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { CssBaseline } from '@mui/material'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Job Aggregator</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}
