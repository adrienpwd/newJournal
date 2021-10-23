db.createUser({
  user: 'mongodbuser',
  pwd: 'ayqgqc2h2o',
  roles: [
    {
      role: 'readWrite',
      db: 'admin'
    }
  ]
});

// db.createUser({
//   user: 'flaskuser',
//   pwd: 'ayqgqc2h2o',
//   roles: [
//     {
//       role: 'dbOwner',
//       db: 'flaskdb'
//     }
//   ]
// });
