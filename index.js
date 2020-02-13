const express = require('express')
const app = express()
const multer = require('multer')

app.use('/fotos', express.static('upload'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload')
    }, filename: (req, file, cb) => {

        const ext = file.originalname.split('.').pop()
        cb(null, Date.now() + '.' + ext)
    }
})

const fileFilter = (req, file, cb) => {

    if (file.originalname.length >= 20) {

        req.erroUpload = "Tamanho do nome muito longo"
        return cb(null, false)

    } else
        cb(null, true)

}

multer.memoryStorage()

app.get('/', (req, res) => {
    res.send('Hello World Multer')
})

const upload = multer({ storage: storage, limits: { fileSize: 10000000 }, fileFilter }).single('arquivo')

app.post('/upload', (req, res) => {
    upload(req, res, (erro) => {
        if (erro instanceof multer.MulterError) {
            if (erro.code == 'LIMIT_FILE_SIZE') {
                return res.status(400).send({ erro: erro.code })
            }
        } else {
            if (req.erroUpload) {
                return res.status(400).send({ erro: req.erroUpload })
            }
            res.send('upload efetuado com sucesso')
        }
    })
})

app.listen(3000, () => {
    console.log('Servidor Online!')
})