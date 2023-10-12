import React, { useState, createContext } from 'react'
import { Outlet } from 'react-router-dom'
import { userData } from './UserData'

export const LendoContext = createContext()

export const LendoContextProvider = (props) => {
    const [data, setData] = useState(userData)

    return (
        <LendoContext.Provider value={{ contextData: [data, setData] }}>
            <Outlet />
        </LendoContext.Provider>
    )
}
