const express = require("express");
const route = express.Router();
const connection = require("../connection/database");

//untuk view data
route.get("/", function (req, res, next) {
  connection.query(
    "SELECT * FROM mahasiswa ORDER BY id desc",
    function (err, rows) {
      if (err) {
        req.flash("error", err);
        res.render("posts", {
          data: "",
        });
      } else {
        //render ke view/posts/index.ejs
        res.render("posts/index", {
          data: rows, //data posts
        });
      }
    }
  );
});

//untuk create data
route.get("/create", function (req, res, next) {
  res.render("posts/create", {
    nim: "",
    nama: "",
    jurusan: "",
  });
});

//simpan posts
route.post("/store", function (req, res, next) {
  let nim = req.body.nim;
  let nama = req.body.nama;
  let jurusan = req.body.jurusan;
  let errors = false;

  if (nim.length === 0) {
    errors = true;
    req.flash("error", "Nim tidak boleh kosong");
    //render ke add.ejs dengan flash message
    res.render("posts/create", {
      nim: nim,
      nama: nama,
      jurusan: jurusan,
    });
  }

  if (nama.length === 0) {
    errors = true;
    req.flash("posts/create", "nama tidak boleh kosong");
    res.render("posts/create", {
      nim: nim,
      nama: nama,
      jurusan: jurusan,
    });
  }

  if (jurusan === 0) {
    errors = true;
    req.flash("posts/create", " jurusan wajib ada");
    res.render("posts/create", {
      nim: nim,
      nama: nama,
      jurusan: jurusan,
    });
  }

  //jika tidak ada error
  if (!errors) {
    let formData = {
      nim: nim,
      nama: nama,
      jurusan: jurusan,
    };

    //insert data query jika validasi sudah terpenuhi
    connection.query(
      "INSERT INTO mahasiswa SET ?",
      formData,
      function (err, results) {
        if (err) {
          req.flash("error", err);

          //render add.ejs
          res.render("posts/create", {
            nim: formData.nim,
            nama: formData.nama,
            jurusan: formData.jurusan,
          });
        } else {
          req.flash("success", "Data berhasil disimpan");
          res.redirect("/posts");
        }
      }
    );
  }
});

//edit post
route.get("/edit/(:id)", function (req, res, next) {
  let id = req.params.id;

  connection.query(
    "SELECT * FROM mahasiswa WHERE id = " + id,
    function (err, rows, fields) {
      if (err) {
        throw err;
      }

      //jika id mahasiswa tidak ditemukan
      if (rows.length <= 0) {
        req.flash("error", "Data dengan id" + id + "tidak ditemukan");
        res.redirect("/posts");
      } else {
        //jika id ditemukan
        res.render("posts/edit", {
          id: rows[0].id,
          nim: rows[0].nim,
          nama: rows[0].nama,
          jurusan: rows[0].jurusan,
        });
      }
    }
  );

  //Update post
  route.post("/update/:id", function (req, res, next) {
    let id = req.params.id;
    let nim = req.body.nim;
    let nama = req.body.nama;
    let jurusan = req.body.jurusan;
    let error = false;

    if (nim.length === 0) {
      error = true;

      req.flash("error", "silahkan masukkan nim");
      res.render("posts/edit", {
        id: id,
        nim: nim,
        nama: nama,
        jurusan: jurusan,
      });
    }

    if (nama.length === 0) {
      error = true;

      req.flash("error", "silahkan masukkan nim");
      res.render("posts/edit", {
        id: id,
        nim: nim,
        nama: nama,
        jurusan: jurusan,
      });
    }

    if (jurusan.length === 0) {
      error = true;

      req.flash("error", "silahkan masukkan nim");
      res.render("posts/edit", {
        id: id,
        nim: nim,
        nama: nama,
        jurusan: jurusan,
      });
    }

    //jika tidak ada error
    if (!error) {
      let formData = {
        nim: nim,
        nama: nama,
        jurusan: jurusan,
      };

      //update query
      connection.query(
        "UPDATE mahasiswa SET ? WHERE id = " + id,
        formData,
        function (err, results) {
          if (err) {
            req.flash("error", err);
            res.render("posts/edit", {
              id: id,
              nim: formData.nim,
              nama: formData.nama,
              jurusan: formData.jurusan,
            });
          } else {
            req.flash("success", "Data berhasil di update!");
            res.redirect("/posts");
          }
        }
      );
    }
  });

  //Delete mahasiswa by id
  route.get("delete/(:id)", function (req, res, next) {
    let id = req.params.id;

    connection.query(
      "SELECT * FROM mahasiswa WHERE id =",
      +id,
      function (err, results) {
        if (err) {
          req.flash("error", err);
          res.redirect("/posts");
        } else {
          req.flash("success", "Data berhasil dihapus");
          res.redirect("/posts");
        }
      }
    );
  });
});
module.exports = route;
