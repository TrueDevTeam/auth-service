const redis = require('redis');

const redisClient = redis.createClient();

const asyncRedisGet = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (error, value) => {
      if (error) {
        return reject(error);
      }
      return resolve(value);
    })
  });
};
const asyncRedisDel = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (error, response) => {
      if (response !== 1) {
        return reject(error);
      }
      return resolve(response);
    })
  });
};

const get = async (tokenHash) => {
  return asyncRedisGet(tokenHash);
};

const add = async (tokenHash) => {
  redisClient.set(tokenHash, '');
};

const remove = async (tokenHash) => {
  return asyncRedisDel(tokenHash);
};

module.exports = {
  add,
  get,
  remove
};
