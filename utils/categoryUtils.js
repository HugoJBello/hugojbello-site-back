var PageEntry = require('../models/pageEntry');
var rename = require ("./renameUtils");

var Category = require('../models/category');


  
function countEntriesWithCategory(name, callback) {
    PageEntry.count({hidden:false, 'categories': name })
      .exec(function (err, count) {
        if (err) throw err;
        if (count===0) deleteCategory(name);
        return callback(count);
      });
  }
  
exports.updateCategory =function (category_name,blog_version) {
    
    category_name=rename.cleanCategoryName(category_name.trim());
    Category.findOne({ 'name': category_name }, function (err, category) {
      if (err) throw err;
      if (!category) {
        var category_new = new Category({
          'name': category_name,
          'created_at': new Date(),
          'number_of_entries':1,
          'blog_version':blog_version
        });
        Category.create(category_new, function (err, raw) {
          if (err) throw err;
          console.log("category created created");
        });
      } else {
        countEntriesWithCategory(category_name, function (count) {
          category.number_of_entries = count;
          category.updated_at = new Date();
          Category.update({ '_id': category._id }, category, function (err, raw) {
            if (err) throw err;
            console.log("category updated");
          });
        });
      }
    });
  }

  function deleteCategory(name){
    Category.deleteOne({ 'name': name },function(err){
    });
  }