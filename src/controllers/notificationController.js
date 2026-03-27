const Notification = require('../models/notification')
const Salle = require('../models/salle')

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      include: [Salle],
      order: [['createdAt', 'DESC']]
    })
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const markAsRead = async (req, res) => {
  try {
    await Notification.update(
      { lu: true },
      { where: { user_id: req.user.id, lu: false } }
    )
    res.json({ message: 'Notifications marquées comme lues' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getMyNotifications,
  markAsRead
}
