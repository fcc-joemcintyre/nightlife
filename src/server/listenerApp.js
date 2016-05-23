'use strict';
const db = require ('./db');
const promiseTry = require ('./promiseTry');

let yelp = null;

// Initialize listeners (currently empty)
function init (_yelp) {
  yelp = _yelp;
}

function search (req, res) {
  console.log ('search', req.query.loc);
  let criteria = {
    category_filter: 'bars',
    location: req.query.loc
  };
  yelp.search (criteria)
  .then (data => {
    let result = [];
    let bars = data.businesses;
    for (let bar of bars) {
      let item = {
        id: bar.id,
        rating: Math.floor (bar.rating * 10),
        ratingImageUrl: bar.rating_img_url,
        name: bar.name,
        snippetText: bar.snippet_text,
        snippetImageUrl: bar.snippet_image_url,
        address: bar.location.display_address.join (', ')
      };
      item.count = 0;
      item.going = false;
      result.push (item);
    }
    Promise.all (result.map ((item) => {
      return db.getGoing (item.id).then (going => {
        if (going) {
          item.count = going.length;
          item.going = false;
          if (req.user && req.user.username) {
            for (let g of going) {
              if (g === req.user.username) {
                item.going = true;
                break;
              }
            }
          }
        }
      });
    }))
    .then (() => { res.status (200).json (result); })
    .catch (err => {
      console.log ('  err:', err);
      res.status (500).json ({});
    });
  }).catch (err => {
    console.log ('search error:', err);
    res.status (500).json ({});
  });
}

function goingList (req, res) {
  console.log ('goingList', req.params);
  promiseTry (() => {
    return db.getBars ();
  }).then (bars => {
    let list = [];
    for (let bar of bars) {
      if (bar.going.indexOf (req.user.username) !== -1) {
        list.push (bar.id);
      }
    }
    res.status (200).json (list);
  }).catch (err => {
    console.log ('  err', err);
    res.status (500).json ({});
  });
}

function going (req, res) {
  console.log ('going', req.params, req.user.username);
  let id = req.params.id;
  let going = req.params.going === '1';

  promiseTry (() => {
    return db.getBarByYelpId (id);
  }).then (result => {
    if (result === null) {
      return db.insertBar ({ id: id, going:[] })
      .then (() => {
        updateGoing (res, id, req.user.username, going);
      });
    } else {
      updateGoing (res, id, req.user.username, going);
    }
  }).catch ((err) => {
    console.log ('  err', err);
    res.status (500).json ({});
  });
}

function updateGoing (res, id, user, going) {
  console.log ('updateGoing', id, user, going);
  promiseTry (() => {
    return db.setGoing (id, user, going);
  }).then (() => {
    return db.getGoing (id);
  }).then ((list) => {
    res.status (200).json ({ id: id, count: list.length });
  }).catch (() => {
    res.status (500).json ({});
  });
}

exports.init = init;
exports.search = search;
exports.goingList = goingList;
exports.going = going;
