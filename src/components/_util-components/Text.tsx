export const Text = ({ text }: { text: string }) => {
  const splittedText = text.split('\\n').map((str, idx) => {
    return <p key={idx}>{str}</p>
  })
  return <div style={{ whiteSpace: 'pre-wrap' }}>{splittedText}</div>
}
