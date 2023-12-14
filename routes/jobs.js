import express from 'express'
import Job from '../models/Job.js'


const router = express.Router()
//add job via post
router.post('/add', (req,res) => {
    
    let {title, salary, company, description, email, new_job} = req.body;
    //inserir dados no sistema
    Job.create({
        title,
        salary,
        company,
        description,
        email,
        new_job
    }).then(() => res.redirect('/')).catch(err => console.log(err))
    
})
//rota de teste
router.get('/test', (req,res) => {
    res.send('TUDO OK.')
})

router.get('/add', (req, res) => {
    res.render('add')
})


//detalhe da vaga
router.get('/view/:id', (req,res) =>
    Job.findOne({
        where : {id: req.params.id}
    }).then(job => {
        res.render('view', {job})
    }).catch(err => console.log(err))
)

export default router