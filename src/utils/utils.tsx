export const avatarInitials = (username: string) => {
  const split = username.split(' ')
  if (split.length === 1) {
    return username.slice(0, 2).toUpperCase()
  } else {
    return `${split[0].slice(0, 1)}${split[1].slice(0, 1)}`.toUpperCase()
  }
}
