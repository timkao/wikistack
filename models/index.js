const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL);
const Promise = require('bluebird');
const marked = require('marked');

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

  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  },

  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  getterMethods: {
    route() {
      return `/wiki/${this.getDataValue('urlTitle')}`
    },
    renderedContent() {
      var regex = /\[{2}(.*?)\]{2}/g
      str = this.content.replace(regex, function(match, selector){
        return `<a href="${selector}">${selector}</a>`
      })
      return str;
    }
  }
});

Page.prototype.findSimilar = function() {

  return Page.findAll({
    where: {
      tags: {
        $overlap: this.tags
      },
      id: {
        $ne: this.id
      }
    }
  })
}


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

Page.findByTag = function(str) {
  return this.findAll({
    where: {
      tags: {
        $overlap: [str]
      }
    }
  })
}


Page.belongsTo(User, {as: 'Author'});
User.hasMany(Page);

function seed() {
  // how to seed a lots of data at one time??
  var page = Page.create({
    title: 'Example One',
    content: '### We do what we do.',
    status: 'open',
    tags: ['perfect', 'handsome', 'nice']
  })

  var user = User.create({
    name: 'Tim Kao',
    email: 'tim.kao@iese.net'
  })

 return Promise.all([page, user])
  .then(function(result){
    result[0].setAuthor(result[1])
  })

}

module.exports = {
  db: db,
  Page: Page,
  User: User,
  seed: seed
};
