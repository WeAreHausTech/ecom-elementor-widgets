declare module '*.css'
declare module '*.css?url' {
  const content: string
  export default content
}
declare module '*.css?raw' {
  const content: string
  export default content
}
