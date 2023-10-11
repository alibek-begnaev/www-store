import { useEffect, useState } from 'react'

import Router from './route/Index'
import { useIdleTimer } from 'react-idle-timer'
import { useCookies } from 'react-cookie'
import ThemeProvider from './layout/provider/Theme'

const App = () => {
    const [cookie, setCookie, removeCookie] = useCookies()

    const onIdle = () => {
        removeCookie('token')
    }

    const { getRemainingTime } = useIdleTimer({
        onIdle,
        timeout: 30 * 60 * 1000,
        throttle: 500,
    })
    return (
        <ThemeProvider>
            <Router />
        </ThemeProvider>
    )
}
export default App
