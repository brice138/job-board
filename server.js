const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

/*const home = require('./routes/dashboard');
const form = require('./routes/form');*/
dotenv.config();
process.env.TOKEN_SECRET;

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/upload'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ credentials: true }));
app.use(fileUpload({ createParentPath: true }));

app.use('/', require('./routes/dashboard'));

/*routes utilisateurs*/
app.use('/users/login', require('./routes/users/login'));
app.use('/users/register', require('./routes/users/register'));
app.use('/users/person', require('./routes/users/person'));
app.use('/users/company', require('./routes/users/company'));
app.use('/users/logout', require('./routes/users/logout'));
app.use('/users/destroy', require('./routes/users/destroy'));

/*routes de gestion de candidatures*/
app.use('/applications', require('./routes/applications'));
app.use('/applications/create', require('./routes/applications/create'));
app.use('/applications/destroy', require('./routes/applications/destroy'));
app.use('/applications/update', require('./routes/applications/update'));

/*routes de gestion des annonces */
app.use('/offers', require('./routes/offers'));
app.use('/offers/create', require('./routes/offers/create'));
app.use('/offers/destroy', require('./routes/offers/destroy'));
app.use('/offers/update', require('./routes/offers/update'));

/*routes admin*/
app.use('/admin', require('./routes/admin'));

app.listen(port, () => {
  console.log(`Server is running on ${port} !!!`);
});
