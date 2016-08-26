var express = require('express');
var fs 		= require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app 	= express();

app.get('/', function(req, res){
	
	getLinks = function($times, callback) {
		var url = 'http://www.doctoralia.com.mx/medicos';
		var $uris = [];
		var proccessed = 0;
		
		for($i = 1; $i <= $times; $i++) {
			request(url + '/' + $i, function(error, response, html){
				if(!error) {
					var $ = cheerio.load(html);
					
					var base = 'http://www.doctoralia.com'
					var listing = $('.listing').children();

					console.log('Processing the list');
					listing.each(function(i, el){
						console.log('iterating list item');
						$uris.push( base + $(el).find('article figure a').attr('href'));
					});

					if(++proccessed == $times) {
						console.log('Total of urls parsed::' + proccessed + ' of ' + $times);
						callback($uris);
					} else {
						console.log('Total of urls parsed::' + proccessed);
					}
				} else {
					console.log(error);
				}
			}.bind($uris));
			console.log('Procesing request with Index::' + $i + ' of ' + $times);
		}
	};

	getLinks(200, function($uris){
		fs.appendFile('doctors_uris.json', JSON.stringify($uris, null, 4), function(err){
			if(err) {
				console.log(err);
				console.log('error');
			} else {
				console.log('finished file created');
			}
		});
	});

	res.send('Check your console');
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;