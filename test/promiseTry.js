/**
 * promiseTry provides a wrapper for the initial function called in a
 * Promise chain. This is specifically for ES2015 Promise supported in
 * Node.js 4.x or later.
 *
 * For example:
 *   getUsers ()
 *   .then (result => {
 *     return getAddresses ();
 *   }).then (result => { ...
 *   }).catch (err => { ... })
 *
 * Becomes:
 *   promiseTry (() => {
 *     return getUsers ();
 *   }).then (result => {
 *     return getAddresses ();
 *   }).then (result => { ...
 *   }).catch (err => { ... })
 */

module.exports = function (fn) {
  return new Promise ((resolve, reject) => {
    resolve (fn ());
  });
};
