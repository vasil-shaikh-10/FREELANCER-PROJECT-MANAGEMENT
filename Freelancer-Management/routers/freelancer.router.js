const {Router} = require('express')
const multer =require('multer')
const {ProjectCreaet, AllProjectShow, ProjectUpdate, ProjectDelete, ProjectExport, Payment} = require('../controllers/freelancer.controller')
const FRouter = Router()

const upload = multer({dest:'uplods/'})

FRouter.get('/prject/show',AllProjectShow)
FRouter.post('/project/create',upload.single('file'),ProjectCreaet)
FRouter.patch('/project/update/:id',ProjectUpdate)
FRouter.delete('/project/delete',ProjectDelete)
FRouter.post('/project/export',ProjectExport)

FRouter.post('/payment',Payment)

module.exports = FRouter