export const avatarInitials = (username: string) => {
  const split = username.split(' ')
  if (split.length === 1) {
    return username.slice(0, 2).toUpperCase()
  } else {
    return `${split[0].slice(0, 1)}${split[1].slice(0, 1)}`.toUpperCase()
  }
}

export const toCamelCase = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toUpperCase() : match.toLowerCase()
  })
}
