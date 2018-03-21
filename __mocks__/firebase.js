const firebase = jest.genMockFromModule('firebase');

const fbapp = {
  id: 1,
};

firebase.apps = [];
firebase.initializeApp = jest.fn(config => {
  firebase.apps.push(fbapp);
  return fbapp;
});

module.exports = firebase;
