const formatterDefault = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'medium',
  timeStyle: 'medium',
})

export default function useDateFormater() {
  return {
    default(date: string) {
      return formatterDefault.format(new Date(date))
    },
  }
}
