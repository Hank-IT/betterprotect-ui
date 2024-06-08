import { DateTime } from 'luxon'


const fromISOToRelativeString = (date) => {
    if (date === ''|| date === undefined) return

    return DateTime.fromISO(date, { locale: "en" }).toRelative()
}

const fromISOToLocalDateTimeString = (date) => {
    if (date === ''|| date === undefined) return

    return DateTime.fromISO(date, { locale: "en" }).toLocaleString({ day: '2-digit', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function() {
    return {
        fromISOToRelativeString,
        fromISOToLocalDateTimeString
    }
}