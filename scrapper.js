var express = require('express');
var fs 		= require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app 	= express();

app.get('/', function(req, res){
	var url = 'http://www.doctoralia.com.mx/medicos';
	var $i = 1;

	getLinks = function($i) {
		request(url, function(error, response, html){
			if(!error) {
				var $ = cheerio.load(html);
				
				var uris = array();
				var base = 'http://www.doctoralia.com'
				var listing = $('.listing').children();

				listing.each(function(i, el){
					uris.push( base + $(el).find('article figure a').attr('href'));
				});

				fs.appendFile('dotors_uris.json', JSON.stringify(uris, null, 4), function(err){
					if(err) {
						console.log(err);
					} else {
						$i++;
						if($i < 5) {
							getLinks($i);
						}
					}
				});	
			}
		}.bind(fs));
	};

	getLinks($i);

	res.send('Check your console');
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;