module.exports = (db) => {
  const express = require("express");
  // eslint-disable-next-line new-cap
  const router = express.Router();

  /**
   * GET /tasks
   * Obtener la lista de todas las tareas.
   */
  router.get("/tasks", async (req, res) => {
    try {
      const taskSnapshot = await db.collection("tareas").get();

      if (taskSnapshot.empty) {
        return res.status(200).json({
          success: true,
          tasks: [],
          message: "No hay tareas disponibles",
        });
      }

      const tasks = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        titulo: doc.data().titulo || "",
        descripcion: doc.data().descripcion || "",
        fecha_creacion: doc.data().fecha_creacion || new Date().toISOString(),
        estado: doc.data().estado || false,
      }));

      return res.status(200).json({success: true, tasks});
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  });

  /**
   * POST /tasks
   * Agregar una nueva tarea.
   */
  router.post("/tasks", async (req, res) => {
    try {
      const {titulo, descripcion, estado} = req.body;

      if (!titulo || !descripcion) {
        return res.status(400).json({
          success: false,
          message: "Título y descripción son obligatorios",
        });
      }

      const newTask = {
        titulo,
        descripcion,
        estado: estado || false,
        fecha_creacion: new Date().toISOString(),
      };

      const docRef = await db.collection("tareas").add(newTask);
      return res.status(201).json({success: true, id: docRef.id, ...newTask});
    } catch (error) {
      console.error("Error al crear tarea:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno al crear la tarea",
        error: error.message,
      });
    }
  });

  /**
   * PUT /tasks/:id
   * Actualizar los datos de una tarea existente.
   */
  router.put("/tasks/:id", async (req, res) => {
    try {
      const {id} = req.params;
      const {titulo, descripcion, estado} = req.body;

      const taskRef = db.collection("tareas").doc(id);
      const doc = await taskRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: "Tarea no encontrada",
        });
      }

      const updateData = {};
      if (titulo !== undefined) updateData.titulo = titulo;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (estado !== undefined) updateData.estado = estado;

      await taskRef.update(updateData);

      return res.status(200).json({
        success: true,
        id,
        message: "Tarea actualizada correctamente",
        ...updateData,
      });
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno al actualizar tarea",
        error: error.message,
      });
    }
  });

  /**
   * DELETE /tasks/:id
   * Eliminar una tarea existente.
   */
  router.delete("/tasks/:id", async (req, res) => {
    try {
      const {id} = req.params;
      const taskRef = db.collection("tareas").doc(id);
      const doc = await taskRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: "Tarea no encontrada",
        });
      }

      await taskRef.delete();
      return res.status(200).json({
        success: true,
        message: "Tarea eliminada correctamente",
        id,
      });
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno al eliminar tarea",
        error: error.message,
      });
    }
  });

  return router;
};
