const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
//app.use("/public", express.static(path.join(__dirname+"public")));
app.use('/public',express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.set('view engine','pug');

//multer config
const multerConfig= {
    storage:multer.diskStorage({

        destination:function (req,file,next) {
            next(null,'./public/images');
        },
        filename: function (req,file,next) {
            console.log(file);
            const ext = file.mimetype.split('/')[1];
            next(null,file.fieldname+"-"+Date.now()+"."+ext);
        }
    }),
    //ensuring the upload of the file or image
    fileFilter:function (req,file,next) {
        if (!file){
            next();
        }
        const image = file.mimetype.startsWith('image/');
        if (image){
            console.log('image uploaded');
            next(null,true);
        } else{
            console.log("file not supported");
            return next();
        }

    }
};

app.get('/',function (req,res) {
    res.render('index')
});

app.post('/upload',multer(multerConfig).single('photo'),function (req,res) {
    var image = req.file.path;
    var dir="http://localhost:3000/";
    console.log(image);
    res.send('Complete!<br><img src='+dir+image+'>');
});

app.listen(port,function () {
    console.log('Server listening on port'+port);
});