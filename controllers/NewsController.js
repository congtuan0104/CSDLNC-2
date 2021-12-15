
class NewsController {
    //[GET]/news
    index(req, res) {
        res.render('news', {
            cssP: () => 'css',
            scriptP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',
        })
    }

    //[GET]/news/:slug
    show(req, res) {
        res.send("New Detail");
    }
}

module.exports = new NewsController;
