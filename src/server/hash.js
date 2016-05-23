'use strict';
const crypto = require ('crypto');

/**
 * Following recommendations of NIST for PBDKF2 implementation
 * http://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf
 *  - salt length of 128 bits, SHA-512 algorithm, 512 bit keylen
 */

function create (password) {
  let salt = crypto.randomBytes (16).toString ('hex');
  let hash = crypto.pbkdf2Sync (password, salt, 2000, 64, 'sha512').toString ('hex');
  return { salt: salt, hash: hash };
}

function compare (password, hash, salt) {
  let key = crypto.pbkdf2Sync (password, salt, 2000, 64, 'sha512').toString ('hex');
  return hash === key;
}

exports.create = create;
exports.compare = compare;
