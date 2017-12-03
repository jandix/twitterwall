# Twitterwall

A simple Twitterwall Application built with Node JS. Fast to install, easy to configure and lightweight code. Old tweets are saved in a Mongo database instance.

Author: Jan Dix (jan@dataflood.de)

License: MIT

## Installation

### Install and Configure Nginx

##### Install Nginx
```
$ sudo apt-get install nginx
```

##### Remove default default configuration
```
$ sudo rm /etc/nginx/sites-enabled/default
```

##### Create new config file
```
$ sudo nano /etc/nginx/sites-available/twitterwall
```
Paste this code into the new file. `twitterwall.example.com` can be replaced by any URL.
```
server {
    listen 80;
    server_name twitterwall.example.com;
    location / {
        proxy_set_header  X-Real-IP  $remote_addr;
        proxy_set_header  Host       $http_host;
        proxy_pass        http://127.0.0.1:8080;
    }
}
```
Link the config file in sites enabled (this will make it seem like the file is actually copied in sites-enabled).
```
$ sudo ln -s /etc/nginx/sites-available/twitterwall /etc/nginx/sites-enabled/twitterwall
```
Restart the server to load new config.
```
$ sudo service nginx restart
```

### Enable SSL with Let's Encrypt and Certbot

##### Install Certbot
```
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install python-certbot-nginx
```

##### Get and Install SSL Certificates

Before you execute this command port 80 (http) and 443 (https) must be open for traffic. 

```
$ sudo certbot --nginx -d twitterwall.example.com
```

When you are asked the statement below, please choose `[2]` to redirect all the traffic to https only. 

```
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
-------------------------------------------------------------------------------
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
-------------------------------------------------------------------------------
Select the appropriate number [1-2] then [enter] (press 'c' to cancel):
```

Your certificates are downloaded, installed, and loaded. Try reloading your website using `https://` and notice your browser's security indicator. It should indicate that the site is properly secured, usually with a green lock icon. If you test your server using the [SSL Labs Server Test](https://www.ssllabs.com/ssltest/), it will get an A grade.

### Install Application

##### Install Node JS
```
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

##### Clone Repository
```
$ git clone https://github.com/jandix/twitterwall
```
##### Install Application Dependencies
```
$ npm install
```

### Configure Application

##### Add Twitter credentials

Create an application at [Twitter Developer](https://developer.twitter.com/) and enter the credentials here.

```js
var twitter = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});
```

##### Enter your hashtags 

Replace `#rstats` with your hashtags or keywords. Multiple keyword can be entered with comma. E.g. `#rstats, #dataviz`.

```js
var stream = twitter.stream('statuses/filter', {track: '#rstats'});
```

##### Add MongoDB credentials

Add your DB onnection string. Free mongo db instances can be configured at [MLab](https://mlab.com/).

```js
var mongoDB = '';
```

### Personalize Application

##### Add Images
Add your logo to `/static/img/logo.png` and adjust the following line in `/views/wall.handlebars` and `/views/error404.handlebars`. 

```html
<img src="/static/img/logo.png" class="img-fluid" style="max-height: 80px;">
``` 

##### Personalize Headings

Add your heading and hashtags to the `h1` and `p` tags in `/views/wall.handlebars` and `/views/error404.handlebars`.

```html
<div class="col-8">
    <h1>Welcome</h1>
    <p>#rstats</p>
</div>
```

##### Adjust meta tags

Adjust the meta tags and favicons to `/static/img/`.

```html
<meta name="description" content="">
<meta name="keywords" content="">
<meta name="author" content="">

<!-- Favicon settings -->
<link rel="apple-touch-icon" sizes="180x180" href="/static/img/apple-touch-icon.png">
<link rel="icon" type="image/png" href="/static/img/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="/static/img/favicon-16x16.png" sizes="16x16">
```

### Install and enable PM2

##### Install PM2 globally
```
npm install pm2 -g
```

##### Start Application with PM2
```
pm2 start bin/www --name twitterwall
```