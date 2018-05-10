/*
 Axis Group Security Client API.
 Copyright 2018-Present, Axis Group, LLC (AXIS).
 Apache License 2.0
*/


/**
* Axis namespace.
* @namespace
*/
var Axis = {
	/**
	* @class
	* @memberof! Axis
	* @alias Axis.Security
	* @hideconstructor
	* @classdesc
	* <p>
	* The Axis.Security is a singleton class that leverage an ADFS portal and JWT to authenticate users.
	* Once authenticated, a qlik sense session is stablished and the user is redirected to the qlik sense portal.
	* </p>
	*/
	Security: (function () {
		var app = require('express')(),
			cookieParser = require('cookie-parser'),
			jwt = require('jsonwebtoken'),
			passport = require('passport'),
			OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
			fs = require('fs'),
			https = require('https'),
			http = require('http'),
			path = require('path'),
			bodyParser = require('body-parser'),
			rootPath = require('app-root-path')
			;
			
			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({extended: true}));
			app.use(cookieParser());
			
			https.globalAgent.options.rejectUnauthorized = false;
			
		return {
			decryptionCert: null,
			serverKey: null,
			serverCert: null,
			/**
			* The client API name.
			* @member {string}
			* @memberof! Axis.Security
			*/
			name: 'Axis.Security',
			/**
			* The client API version.
			* @member {string}
			* @memberof! Axis.Security
			*/
			version: '1.0.0',
			/**
			* Indicates whether the instance runs in debug mode.
			* @member {boolean}
			* @memberof! Axis.Security
			*/
			debug: false,
			/**
			* An instance of the passport class.
			* @member {object}
			* @memberof! Axis.Security
			*/
			passport: passport,
			/**
			* The listening host.
			* @member {string}
			* @memberof! Axis.Security
			*/
			host: null,
			/**
			* The listening port.
			* @member {number}
			* @memberof! Axis.Security
			*/
			port: null,
			/**
			* An instance of the strategy class.
			* @member {object}
			* @memberof! Axis.Security
			*/
			strategy: null,
			/**
			* The uri adfs authorization endpoint.
			* @member {string}
			* @memberof! Axis.Security
			*/
			authorizationURL: null,
			/**
			* The uri adfs token endpoint.
			* @member {string}
			* @memberof! Axis.Security
			*/
			tokenURL: null,
			/**
			* The qlik sense client identifier.
			* @member {string}
			* @memberof! Axis.Security
			*/
			clientID: null,
			/**
			* The qlik sense host.
			* @member {string}
			* @memberof! Axis.Security
			*/
			qsHost: null,
			/**
			* The qlik sense uri prefix.
			* @member {string}
			* @memberof! Axis.Security
			*/
			qsPrefix: null,
			/**
			* A header pass to qlik sense during the authentication process.
			* @member {string}
			* @memberof! Axis.Security
			*/
			xrfkey: null,
			/**
			* This method is used to request authorization to a qlik sense server. Internal use.
			* @param {string} [token] the security token.
			* @return {Promise} an instance of a promise.
			* @memberof! Axis.Security
			*/
			authorize: function (token) {
				var self = this;
				return new Promise(function(resolve) {
					var cookie;
					var options = {
						hostname: self.qsHost,
						port: 443,
						path: "/" + self.qsPrefix + "/qrs/about?xrfkey=" + self.xrfkey,
						method: 'GET',
						headers: {
							'X-Qlik-Xrfkey': self.xrfkey,
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + token
			 
						},
						'rejectUnauthorized': false
					};

					var request = https.request(options, function(response) {
						cookie = response.headers['set-cookie'];
						console.log("XCookie: " + cookie);
						
						response.on('data', function(data) {
							process.stdout.write(JSON.stringify(JSON.parse(data)));
							resolve(cookie);
						})
						resolve(cookie);
					});
					
					request.on('error', function(error) {
						console.log(error);
					});

					request.end();
				})
			},
			/**
			* Use this method to initialize the security attributes/properties used during client requests.
			* @param {object} [attributes] an object containing key/value pair used to set the Axis.Security object initial attributes/properties values.
			* @return {Promise} the current instance.
			* @memberof! Axis.Security
			*/
			setup: function(a){
				var self = this;

				if(a === void 0) return this;

				for (var n in a)
					if(n in this){
						this[n] = a[n];
						if(this.debug)
							console.log(' .. ' + n + ' = ' + a[n]);
					}
				
				var attrbs = {
					authorizationURL: this.authorizationURL,
					tokenURL: this.tokenURL,
					clientID: this.clientID,
					callbackURL: this.host + ':' + this.port + '/callback' 
				};
				
				this.decryptionCert = fs.readFileSync(rootPath.path + "\\" + this.decryptionCert);
				this.serverKey = fs.readFileSync(rootPath.path + "\\" + this.serverKey);
				this.serverCert = fs.readFileSync(rootPath.path + "\\" + this.serverCert);
				
				/* strategy configuration */
				this.strategy = new OAuth2Strategy(attrbs,
				function(accessToken, refreshToken, profile, done) {
					done(null, profile);
				});
				
				this.strategy.authorizationParams = function(options) {
				  return {
					resource: 'urn:federation:MicrosoftOnline' // An identifier corresponding to the RPT
				  };
				};
				
				this.strategy.userProfile = function(accessToken, done) {
					done(null, accessToken);
				};
				
				/* passport configuration */
				this.passport.use('provider', this.strategy);
				this.passport.serializeUser(function(user, done) {
					done(null, user);
				});
				this.passport.deserializeUser(function(user, done) {
					done(null, user);
				});
				
				app.use(this.passport.initialize());
				
				app.get('/login', this.passport.authenticate('provider'));
				app.get('/callback', this.passport.authenticate('provider'), function(request, response) {
					response.redirect("https://" + self.qsHost + ':' + self.port + '/auth?token=' + request.user);
				});
				
				app.get('/auth', function (request, response) {
					
					response.cookie('accessToken', request.query.token);
					
					self
					.authorize(request.query.token)
					.then(function(res) {
						response.header('set-cookie', res);
					})
					.then(function() {
						response.redirect("https://" + self.qsHost + "/" + self.qsPrefix + "/hub");
					});
				});
				
				app.get('/logout', function (request, response) {
					response.clearCookie('accessToken');
					response.redirect('/');
				});
			
				app.get('/', function (request, response) {
					response.redirect('/login');
				});
				
				app.get('/quit', function(req,res) {
				  app.close();
				});
				
				return this;
			},
			/**
			* Use this method to begin listening for client requests.
			* @return {object} the current instance.
			* @memberof! Axis.Security
			*/
			listen: function(){
				
				var httpsoptions = {
					key: this.serverKey,
					cert: this.serverCert
				};


				var server = https.createServer(httpsoptions, app);
				server.listen(this.port, function() {
					console.log("JWT test server started");
				})
				
				return this;
			}
		}
	})()
};

/* initialize/setup & listen for requests */
Axis.Security.setup({
	debug: true,
	host: 'https://localhost',
	port: 3000,
	authorizationURL: 'https://adfs.axis.lab/adfs/oauth2/authorize',
	tokenURL: 'https://adfs.axis.lab/adfs/oauth2/token',
	clientID: 'ad762716-544d-4aeb-a526-687b73838a36',
	qsHost: 'svwaxqsentest03.contoso.com',
	qsPrefix: 'jwt',
	xrfkey: 'ABCDEFG123456789',
	decryptionCert: 'ADFScert.pem',
	serverKey: 'ADFSserver.key',
	serverCert: 'ADFScert.pem'
})
.listen();
