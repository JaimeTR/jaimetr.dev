import HighlightCode from './HighlightCode'

export default function ArticleBody({ content }) {
  return <>
    <div className="prose-ed min-w-0" dangerouslySetInnerHTML={{ __html: content }} />
    <HighlightCode />
  </>
}
