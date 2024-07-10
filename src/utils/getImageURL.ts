export const getImageURL = (relativePath: string)=>{
  const publicURL = import.meta.env.VITE_PUBLIC_URL

  return `${publicURL}${relativePath}`
}
