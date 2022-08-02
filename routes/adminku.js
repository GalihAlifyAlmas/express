const connection = require('express-myconnection');
var mysql = require('mysql');
var multer = require('multer');


exports.login = function(req, res){
    var message = '';
    var sess= req.session;
    var md5 = require('md5');

    if(req.method == 'POST'){
        //Jika route method-nya adalah POST, lakukan prosses authentikasi login!

        // 1. tangkap nilai dari atribut pada body
        var post = req.body;

        console.log(post);
        // 2. tangkap nilai atribut name dari form input username dan password
        var name = post.username;
        //var pass = post.password;

        var pass = md5(post.password);

        // 3. lakukan koneksi dan query data admin
        req.getConnection(function(err, connect){

            var sql = "SELECT id_admin, username, name, admin_level FROM admin_tbl WHERE username='"+name+ "' AND password='"+pass+"'";
            var query = connect.query(sql, function(err, results){
                if (results.length){
                    //jika hasil query ada , dan
                    req.session.adminId = results[0].id_admin;
                    req.session.admin = results[0];
                    console.log(results[0].id_admin);
                    res.redirect('./home');
                } else {
                    // jika hasil queri tidak ada tapilkan pesaan error
                    message = 'Username dan password anda salah.';
                    res.render('./admin/index', {
                        message: message,
                    });
                }
            });
        });


    }else {
        res.render('./admin/index', {
            message: message
        });
    }

    
}
exports.home = function(req, res) {
    req.getConnection(function(err, connect) {
        var sql = "SELECT * FROM news_tbl ORDER BY createdate DESC";

        var query = connect.query(sql, function(err, results) {
            // jika koneksi dan query berhasil, tampilkan home admin!
            res.render('./admin/home', {
                pathname: 'home',
                data : results
            });
        });
    });   
}

exports.add_news = function(req, res) {
    res.render('./admin/home', {
        pathname: 'add_news'
    });
}

exports.process_add_news = function(req, res) {

 
    var storage = multer.diskStorage({
        destination: './public/news_images',
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var upload = multer ({storage: storage}).single('image');
    var date = new Date(Date.now());

    upload(req, res, function(err) {
     //  var post = req.body;

        if (err) {
            return res.end('Error uploading image!');
        }

        console.log(req.file);
        // { title: 'product' }
        // console.log(post);

        //DILUAR VIDEO
        const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
        const file = JSON.parse(JSON.stringify(req.file));
        console.log(obj);

        req.getConnection(function(err, connect) {

            var post = {
                        title: obj.title,
                        description: obj.description,
                        images: file.filename,
                        createdate: date
                      
                    }

            var sql = "INSERT INTO news_tbl SET ?";
            var query = connect.query(sql, post, function(err, results){
                if (err) {
                    console.log('Error input news: %s', err);
                }

                req.flash('info', 'Success edit data! Data has been updated.');
                res.redirect('/express/admin/home');
            });
        });

        //SESUAI VIDEO
        // req.getConnection(function(req, res, connect) {
           
        //     // tangkap nilai atau value dari body (atribute name)
        //     var post = {
        //         title: obj.title,
        //         description: obj.description,
        //         Image: file.filename,
        //         createdate: date
              
        //     }

        //     console.log(post);


            
            
        //     // console.log(post); //untuk menampilkan data post di console
            
        //     var sql = "INSERT INTO news_tbl SET ?";
        //     console.log(sql);
        //     var query = connect.query(sql, post, function(err, results) {
        //         if (err) {
        //             console.log('Error input news: %s', err);
        //         }

        //         res.redirect('/express/admin/home');

        //     });
        // });
    
    });
}

exports.edit_news = function(req, res) {
    //tangkap id news dari link edit
    var id_news = req.params.id_news;

    req.getConnection(function(err, connect) {
        var sql = "SELECT * FROM news_tbl WHERE id_news=?";

        var query = connect.query(sql, id_news, function(err, results) {
            if (err) {
                console.log('Error show news: %s', err);
            }

            res.render('./admin/home', {
                id_news: id_news, 
                pathname: 'edit_news',
                data: results
            });
        });

    });
}

exports.process_edit_news = function(req, res) {
    var id_news = req.params.id_news;

    var storage = multer.diskStorage({
        description: './public/news_images',
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var upload = multer({ storage: storage }).single('image');
    var date = new Date(Date.now());

    upload(req, res, function(err) {
        if (err) {
            var image = req.body.image_old;
            console.log("Error uploading image!");
        } else if (req.file == undefined) {
            var image = req.body.image_old;
        } else {
            var image = req.file.filename;
        }

        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect) {
            var post = {
                title: req.body.title,
                description: req.body.description,
                images: image,
                createdate: date  
            }

            var sql = "UPDATE news_tbl SET ? WHERE id_news=?";

            var query = connect.query(sql, [post, id_news], function(err, results) {
                if (err) {
                    console.log("Error edit news: %s", err);               
                 }

                 req.flash('info', 'Success edit data! Data has been updated.');
                 res.redirect('/express/admin/home');
            });
        });
    });
}