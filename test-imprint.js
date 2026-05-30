import { client } from './src/sanity/client.js'

async function run() {
  const imprints = await client.fetch(`*[_type == "imprint"] { ... }`)
  console.log(JSON.stringify(imprints, null, 2))
}
run()
