const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
const nodemailer = require('nodemailer')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));

app.get('/Inicio', (req, res) => res.render('pages/Inicio'))
app.get('/Nosotros', (req, res) => res.render('pages/Nosotros'))
app.get('/Servicios', (req, res) => res.render('pages/Servicios'))
app.get('/Contactos', (req, res) => res.render('pages/Contactos'))


//Conexión sql
const connection = mysql.createConnection({
    host: 'freedb.tech',
    user: 'freedbtech_BraulinEMP',
    password: 'LOLGGXD',
    database: 'freedbtech_ProyectoFinalDB',
})

//Check Connect
connection.connect(error => {
    if (error) throw error;
    console.log('Database running');
})

app.get('/Usuarios', (req, res) => {
    const sql = 'SELECT * FROM Usuarios';

    connection.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        res.render('pages/Usuarios', {
            'results': results
        })
    })
});

app.get('/Formulario', (req, res) => res.render('pages/Formulario'))

app.post('/Formulario', (req, res) => {
    const sql = `SELECT * FROM Usuarios WHERE Correo = '${req.body.Correo}'`;
    const sql2 = 'INSERT INTO Usuarios SET ?';

    const {
        Nombre,
        Correo,
        mensaje
    } = req.body;

    contentHTML = `
        <h1>Recibido!</h1>
        <ul>
           <li>Nombre: ${Nombre}</li>
           <li>Correo: ${Correo}</li>
       </ul>
        <p>${mensaje}</p>
    `

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'proyectofinalbraulin@gmail.com',
            pass: 'Cocolopaloechao'
        }


    })
    const info = {
        from: 'proyectofinalbraulin@gmail.com',
        to: 'braulinemp@gmail.com',
        subject: 'Formulario de contacto',
        html: contentHTML
    }

    connection.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        if (!results.length > 0) {
            const usuariosObj = {
                Nombre: req.body.Nombre,
                Correo: req.body.Correo
            }
            connection.query(sql2, usuariosObj, error => {
                if (error) {
                    throw error;
                }

            })
        }
        //Enviar correo
        transporter.sendMail(info, error => {
            if (error) {
                throw error;
            } else {
                console.log('Email Enviado!')
            }
        })

    })
    res.render('pages/Inicio')
})


app.listen(port, () => console.log('Server running'))