const { v4: uuidv4 } = require('uuid')

const Helpers = use('Helpers')
const Drive = use('Drive')

async function updadeFile({ folder, subFolder, file }) {
  let url = ''

  try {
    const file_name = `${uuidv4()}.${file.extname}`
    const ContentType = file.headers['content-type']

    const filePath = `${folder}/${
      subFolder ? subFolder + '/' + file_name : file_name
    }`
  
    await file.move(Helpers.tmpPath('uploads'), {
      name: file_name,
      overwrite: true
    })
  
    if (!file.moved()) {
      return file.error()
    }

    const tmpPath = await Drive.disk('local').get(`uploads/${file_name}`)

    url = await Drive.put(filePath, tmpPath, {
      ContentType,
      ACL: 'public-read',
    })

    await Drive.disk('local').delete(`uploads/${file_name}`)

    return {
      url,
      filePath
    }
  } catch (err) {
    console.error('updadeFile', err)
  }
}

module.exports = updadeFile
