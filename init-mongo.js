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
