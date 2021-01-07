export default class UploadAdapter {
  constructor (loader) {
    // The file loader instance to use during the upload.
    this.loader = loader
  }

  // Starts the upload process.
  upload () {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader()

      reader.addEventListener('load', () => {
        resolve({ default: reader.result })
      })

      reader.addEventListener('error', err => {
        reject(err)
      })

      reader.addEventListener('abort', (e) => {
        reject(e)
      })

      this.loader.file.then(file => {
        reader.readAsDataURL(file)
      })
    })
  }

  // Aborts the upload process.
  abort () {
    //
  }
}

export const uploader = function (editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => new UploadAdapter(loader)
}
