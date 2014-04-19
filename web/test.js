module.exports = function(app){


	app.get('/', function(req, res){

		res.render('index', {
			layout: true,
			locals: {
				name: "kalle", 
				data: "hugo"
			}
		})

	});


}