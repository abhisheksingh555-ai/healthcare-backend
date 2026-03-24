require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const { sequelize } = require('./models');
const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Make app name available in all views
app.use((req, res, next) => {
  res.locals.appName = process.env.APP_NAME || 'Healthcare Backend';
  res.locals.user = null;
  next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/', webRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized.');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📋 API base: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err.message);
    process.exit(1);
  }
};

start();
