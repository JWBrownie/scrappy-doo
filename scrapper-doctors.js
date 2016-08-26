var express = require('express');
var fs 		= require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app 	= express();

app.get('/doctors', function(req, res){
	var doctors_list = null;
	fs.readFile('doctors_uris.json', 'utf8', function(err, data){
		if(err) throw err;
		doctors_list = JSON.parse(data);
		fetchDoctors(doctors_list, 3000, 1000, function(err, data){
			if(err) throw err;
			fs.appendFile('doctors_data.json', JSON.stringify(data, null, 4), function(err){
				if(err) throw err;
				console.log('Finished file created');
			});
		});
	});
	res.send('Things are happening in your console');
});

function fetchDoctors($list, $start, $ends, callback)
{
	var complete_count = 0;
	var doctors_data = [];
	$list = $list.splice($start, $ends);

	$list.forEach( function(url, index)
	{
		request(url, function(err, response, html){
			if(err) callback(err);

			var $ = cheerio.load(html);

			var doctor = {
				fullname: '',
				profession: '',
				specialties: '',
				cedula: '',
				address: '',
				building: '',
				phones: [],
				comments: [],
				url: url
			};

			doctor.fullname = $('div.title h1').text();
			doctor.profession = $('div.title #doctorSpecialities p').first().text();
			doctor.specialties = $('div.title #doctorSpecialities p.subspecialities').text();
			doctor.cedula = $('div.header-content p.regnum').text();
			doctor.building = $('#main > div > section.box.booking > div.booking-filter.no-bullet > form > div').text();
			doctor.address = $('.booking form span.doctorplacesaddress label a.more').data('full-address');

			doctors_data.push(doctor);
			if(++complete_count == $list.length) {
				callback(false, doctors_data);
			} else {
				console.log( doctor.fullname + ', is ready, complete count::' + complete_count + ' of a total ' + $list.length);
			}
		});
		console.log('for loop current index::' + index);
	})
}

function fetchDoctor($uri, callback)
{

}

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;