const Notification = require('../models/notification')


const createNotification = async (req, res) => {
  try {
    const { user_id, titre, message } = req.body
    if (!user_id || !titre || !message) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' })
    }

    const notification = await Notification.create({
      user_id,
      titre,
      message,
      lu: false
    })

    res.status(201).json(notification)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    })

    res.json(notifications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id)
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' })
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await notification.update({ lu: true })
    res.json({ message: 'Notification marquée comme lue' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id)
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' })
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await notification.destroy()
    res.json({ message: 'Notification supprimée' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification
}
