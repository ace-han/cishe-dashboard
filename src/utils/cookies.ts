import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

// User
const loggedInKey = 'loggedIn'
export const getLoggedIn = () => Cookies.get(loggedInKey)

const csrftokenKey = 'csrftoken'
export const getCsrfToken = () => Cookies.get(csrftokenKey)
export const setCsrfToken = (csrftoken: string) => Cookies.set(csrftokenKey, csrftoken)
