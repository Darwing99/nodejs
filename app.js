const { response } = require('express');
const express= require('express');
const app=express();

app.use(express.json());



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
app.get('/api/people',(req,res)=>{
    res.send(['people','User','datos','resp']);
});


// app.get('/api/user/:year/:mounth',(req,res)=>{
//     res.send(req.query);
// });


app.get('/api/user/lista',(req,res)=>{

    res.send(req.params);
    
});


//busqueda de usuarios por id
app.get('/api/user/:id',(req,res)=>{
    let user=usuarios.find(u=>
        u.id===parseInt(req.params.id)
    );
    if(!user) res.status(404).send('el usuario no fue encontrado');
    res.send(user);
    
});


// app.post();//envio de datos

app.post('/api/users',(req, res)=>{

    const user={
        id: usuarios.length+1,
        nombre: req.body.nombre
    };
    usuarios.push(user);
    res.send(user);

});


// app.put();//actualizacion
// app.delete();//eliminacion


// variable de entorno por si el puerto cambia al momento del deploy
const port=process.env.PORT || 3000;

app.listen(port,()=>{

    console.log(`escuchanndo en el puerto ${port}...`);


});