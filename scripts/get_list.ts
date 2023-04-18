import fs from 'fs'
import path from 'path'

const getLanguageFiles = async () => {
  const languagesPath = '../public/languages'

  try {
    const filenames = await fs.promises.readdir(languagesPath)
    const formattedFilenames = []
    for (let i = 0; i < filenames.length; i++) {
      formattedFilenames.push(filenames[i].split('.')[0])
    }
    await fs.promises.writeFile('_list_languages.json', JSON.stringify(formattedFilenames, null, 2))
    console.log('Successfully written to _list_languages.json')
    return filenames
  } catch (error) {
    console.error('Error reading language files:', error)
    throw new Error('Error reading language files')
  }
}

getLanguageFiles()
