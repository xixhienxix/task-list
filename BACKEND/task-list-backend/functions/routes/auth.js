module.exports = (db) => {
  const express = require("express");
  // eslint-disable-next-line new-cap
  const router = express.Router();

  /** POST /login
   * Agrega un nuevo usuario
  */
  router.post("/login", async (req, res) => {
    const {email} = req.body;
    if (!email) {
      return res.json(
          {errorCode: 41, message: "Email obligatorio"});
    }

    const userSnapshot = await db.collection("usuarios")
        .where("email", "==", email)
        .get();

    if (userSnapshot.empty) {
      return res.json(
          {errorCode: 40,
            message: "Usuario no registrado, registese antes de poder acceder",
          });
    }

    const user = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id;

    return res.json({success: true, id: userId, ...user});
  });

  /** POST /register
   * Registra un nuevo usuario
  */
  router.post("/register", async (req, res) => {
    const {email, name} = req.body;
    if (!email) {
      return res.json(
          {errorCode: 41, message: "email es obligatorio"});
    }

    const userSnapshot = await db.collection("usuarios")
        .where("email", "==", email)
        .get();

    if (!userSnapshot.empty) {
      return res.json(
          {errorCode: 42, message: "El usuario ya existe!"});
    }

    const docRef = await db.collection("usuarios").add({email});
    return res.json(
        {success: true, id: docRef.id, name, email});
  });

  return router;
};
