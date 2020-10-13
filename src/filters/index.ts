import moment from 'moment'

export const parseMoment = (m: string | moment.Moment, format?: string): string => {
  let result = ''
  if (!m) {
    return result
  }
  if (format) {
    result = moment(m).format(format)
  } else {
    result = moment(m).format()
  }
  return result
}
