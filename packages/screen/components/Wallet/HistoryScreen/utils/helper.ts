import dayjs from 'dayjs'

export const sortLastestTimeToRender = (data: any[]) => {
  return data.sort(
    (a, b) =>
      convertTimeToUnixTime(b.timestamp) - convertTimeToUnixTime(a.timestamp)
  )
}

export const convertTimeToUnixTime = (time: string) => {
  return Number(new Date(time).getTime())
}

export const formatTimeStamp = (time: number) => {
  return dayjs(time * 1000).format('HH:mm DD/MM/YYYY')
}
