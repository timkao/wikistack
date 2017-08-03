const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL);

// helper
function convertTitle(title) {
  // replace space with _ -> replace symbols with '' -> replace multiple _ with single _
  return title.replace(/\s/g, '_').replace(/\W/g, '').replace(/\_+/g, '_');
}

var Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
});

Page.hook('beforeValidate', (page, options) => {
  page.urlTitle = convertTitle(page.title);
})

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

module.exports = {
  db: db,
  Page: Page,
  User: User
};
