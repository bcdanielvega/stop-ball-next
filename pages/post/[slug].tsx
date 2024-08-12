// [slug].tsx

import client from '../../client'

const Post = (props:any) => {
  const { title = 'Missing title', name = 'Missing name' } = props.post
  return (
    <article>
      <h1>{title}</h1>
      <span>By {name}</span>
    </article>
  )
}

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug:any) => ({params: {slug}})),
    fallback: true,
  }
}

export async function getStaticProps(context:any) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params
  const post = await client.fetch(`
    *[_type == "post" && slug.current == $slug][0]{title, "name": author->name}
  `, { slug })
  return {
    props: {
      post
    }
  }
}

export default Post