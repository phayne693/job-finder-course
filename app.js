import express from 'express';
import sequelize from './db/connection.js'
import bodyParser from 'body-parser';
import jobsRouter from './routes/jobs.js';
import { engine } from 'express-handlebars';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Job from './models/Job.js';
import { Sequelize } from 'sequelize';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const Op = Sequelize.Op
const app = express();
const port = 3000;
const db = sequelize

app.listen(port, function(){
    console.log("Server is running on port " + port);
})

app.use(bodyParser.urlencoded({ extended: false }));
//handlebars setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname,'public')))


//db connection
db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err =>{
    console.log('Error in connection')
});

//routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%'
    if(!search){
        //traz todos os dados do banco para index.handlebars
        Job.findAll({
            order:[
                ['createdAt', 'DESC']
            ]
        }).then(jobs => {
            res.render('index', {jobs});
        }).catch(err => console.log(err))
    }else{
        //fazemos a pesquisa dos items no banco de dados
        Job.findAll({
            where:{title: {[Op.like]: query}},
            order:[
                ['createdAt', 'DESC']
            ]
        }).then(jobs => {
            res.render('index', {jobs, query});
        }).catch(err => console.log(err))
    }
   

});

//jobs routes
app.use('/jobs', jobsRouter);


