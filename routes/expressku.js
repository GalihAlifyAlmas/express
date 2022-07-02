exports.home = function (req, res) {
    req.getConnection(function (err, connect) {
        var query = connect.query('SELECT * FROM news_tbl', function (err, rows) {
            if (err) {
                console.log('Error massage: %', err);
            }

            res.render('home', {
                page_tittle: "Express News",
                data: rows
            });
        });
    });
}

exports.news = function (req, res) {
    res.render('news');
}

exports.about = function (req, res) {
    res.render('about');
}

exports.contact = function (req, res) {
    res.render('contact');
}

exports.gallery = function (req, res) {
    res.render('gallery');
}