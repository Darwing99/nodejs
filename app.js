const inicioDebug=require('debug')('app:inicio');
const joi=require('@hapi/joi');
const config=require('config');

const dbDebug=require('debug')('app:database');
const morgan=require('morgan');

const express= require('express');
const logger=require('./logger');


const app=express();

app.use(express.json());

app.use(express.urlencoded({extended:true}))



//configuacion de entornos

// console.log('Application'+config.get('nombre'));
// console.log('DB server ' +config.get('nombre'+config.get('configDB.host')));
// para acceder a archivos estaticos
app.use(express.static('public'));

// app.use(logger);
// app.use(function(req,res,next){
//     console.log('Autenticando...');
//     next();
// })

// //uso de middleware de terceros
// if(app.get('env')==='development'){
//     app.use(morgan('tiny'));
//     inicioDebug('morgan habilitado')

// }
// // TRbajos db
// dbDebug('conectando con la base de datos');

const usuarios=[
    {id:1,nombre:'Darwing Hernandez'},
    {id:2,nombre:'Elkin Hernandez'},
    {id:3,nombre:'Jesus Hernandez'},
    {id:4,nombre:'MAriela Hernandez'}
]
//peticion
app.get('/',(req,res)=>{
    res.send('user: Darwing' );
});
app.get('/api/usuarios',(req,res)=>{
    res.send(usuarios);
});


// app.get('/api/user/:year/:mounth',(req,res)=>{
//     res.send(req.query);
// });


app.get('/api/user/lista',(req,res)=>{

    res.send(req.params);
    
});


//busqueda de usuarios por id
app.get('/api/user/:id',(req,res)=>{
    // llamando a funcion
    let user=existeUser(req.params.id);


    if(!user){
        res.status(404).send('el usuario no fue encontrado');
        return;
    } 
    res.send(user);
    
});


// app.post();//envio de datos

app.post('/api/users',(req, res)=>{


    // let body=req.body;
    // console.log(body.nombre);
    // res.json({
    //     body
    // })


    // validacion de datos enviados 
    const schema=joi.object({
        nombre:joi.string()
        .alphanum()
        .min(3)
        .max(100)
        .required()
    });
   //usando la funcion de validacion 
    const {error,value}=schemaValidar(req.body.nombre);

    
    if(!error){
        const user={
            id: usuarios.length+1,
            nombre:value.nombre
        };
        usuarios.push(user);
        res.send(user);
    }else{
        
            const mensaje=error.details[0].message;
            res.status(400).send(mensaje);
            
        
    }
    

});

// app.put();//actualizacion


app.put('/api/usuario/:id',(req,res)=>{
    //encontrar si existe el usuario

    // let usuario=usuarios.find(u=>u.id===parseInt(req.params.id));
    let usuario=existeUser(req.params.id);//funcion de busqueda
    
    if(!usuario) {
        res.status(404).send('usuario no existe');
        return;
    }

     //usando la funcion de validacion 
    const {error,value}=schemaValidar(req.body.nombre);
    if(error){
        const mensaje=error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }
    usuario.nombre=value.nombre;
    res.send(usuario);
})
// app.delete();//eliminacion
app.delete('/api/usuarios/:id',(req,res)=>{
    let usuario=existeUser(req.params.id);

    if(!usuario) {
            res.status(404).send('usuario no existe');
            return;
    }
    const index=usuarios.indexOf(usuario);
    usuarios.splice(index,1);
    res.send(usuarios);

});



// variable de entorno por si el puerto cambia al momento del deploy
const port=process.env.PORT || 3000;

app.listen(port,()=>{

    console.log(`escuchanndo en el puerto ${port}...`);


});


function existeUser(id){
    return usuarios.find(u=>u.id===parseInt(id));
}



function schemaValidar(name){
    const schema=joi.object({
        nombre:joi.string().min(3).required(),
  
    });
    return schema.validate({nombre:name});
    
}