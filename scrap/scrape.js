var request = require('request');
var cheerio = require('cheerio');

request('https://news.ycombinator.com', function(error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('span.comhead').each(function(i, element) {
            var a = $(this).prev();
            var rank = a.parent().parent().text();
            var title = a.text();
            var url = a.attr('href');
            var subtext = a.parent().parent().next().children('.subtext').children();
            console.log('subtext : ' + subtext);
            var points = $(subtext).eq(0).text();
            console.log('points : ' + points);
            var username = $(subtext).eq(1).text();
            console.log('username : ' + username);
            var comments = $(subtext).eq(2).text();
            console.log('comments : ' + comments);
            console.log('-------------------');
        });
    } else {
        console.log("error: " + error);
    }
});

