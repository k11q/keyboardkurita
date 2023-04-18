import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const CHUNK_SIZE = 1000

async function upsertSubwords (subwords) {
  const chunkCount = Math.ceil(subwords.length / CHUNK_SIZE)

  for (let i = 0; i < chunkCount; i++) {
    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, subwords.length)
    const chunk = subwords.slice(start, end)

    try {
      const { data, error } = await supabase
        .from('subwords')
        .upsert(chunk, { onConflict: 'subword' })

      if (error != null) {
        console.error(
					`Error upserting chunk ${
						i + 1
					} of ${chunkCount}:`,
					error
        )
      } else {
        console.log(
					`Chunk ${
						i + 1
					} of ${chunkCount} upserted successfully.`
        )
      }
    } catch (err) {
      console.error(
				`Error upserting chunk ${
					i + 1
				} of ${chunkCount}:`,
				err
      )
    }
  }
}

function processMorphemes (morphemes) {
  const subwords = []

  for (const key in morphemes) {
    let type
    let length = key.length

    if (key.endsWith('-') && key.startsWith('-')) {
      type = 'embedded'
      length -= 2
    } else if (key.endsWith('-')) {
      type = 'prefix'
      length--
    } else if (key.startsWith('-')) {
      type = 'suffix'
      length--
    } else {
      type = 'root'
    }

    subwords.push({
      subword: key,
      length,
      type
    })
  }

  return subwords
}

fs.readFile('subword.json', 'utf-8', (err, data) => {
  if (err != null) {
    console.error('Error reading subwords.json:', err)
    return
  }

  const morphemes = JSON.parse(data)
  const subwordsToInsert = processMorphemes(morphemes)
  upsertSubwords(subwordsToInsert)
})
