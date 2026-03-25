const Message = require('../models/message');
const User = require('../models/user');
const Salle = require('../models/salle');

const sendMessage = async (req, res) => {
  try {
    const { receiver_id, salle_id, content } = req.body;
    const sender_id = req.user?.id;

    if (!sender_id) return res.status(401).json({ message: 'Non authentifié' });
    if (!receiver_id || !content) return res.status(400).json({ message: 'Destinataire et contenu obligatoires' });

    const message = await Message.create({ sender_id, receiver_id, salle_id: salle_id || null, content });
    return res.status(201).json(message);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// READ - récupérer messages entre deux utilisateurs
const getMessages = async (req, res) => {
  try {
    const { other_user_id, salle_id } = req.query;
    const my_id = req.user?.id;

    if (!my_id) return res.status(401).json({ message: 'Non authentifié' });
    if (!other_user_id) return res.status(400).json({ message: "ID de l'autre utilisateur obligatoire" });

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: my_id, receiver_id: other_user_id },
          { sender_id: other_user_id, receiver_id: my_id }
        ],
        ...(salle_id && { salle_id })
      },
      order: [['createdAt', 'ASC']]
    });
    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// READ - inbox / liste des conversations
const getInbox = async (req, res) => {
  try {
    const my_id = req.user?.id;
    if (!my_id) return res.status(401).json({ message: 'Non authentifié' });

    const messages = await Message.findAll({
      where: { [Op.or]: [{ sender_id: my_id }, { receiver_id: my_id }] },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'nom'] },
        { model: User, as: 'receiver', attributes: ['id', 'nom'] },
        { model: Salle, attributes: ['id', 'nom'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const conversations = [];
    const seen = new Set();

    for (const msg of messages) {
      const otherUser = msg.sender_id === my_id ? msg.receiver : msg.sender;
      if (!otherUser) continue;

      const key = `${Math.min(my_id, otherUser.id)}-${Math.max(my_id, otherUser.id)}-${msg.salle_id || 'no-salle'}`;
      if (!seen.has(key)) {
        seen.add(key);
        conversations.push({ other_user: otherUser, salle: msg.salle, last_message: msg });
      }
    }
    return res.json(conversations);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// UPDATE - marquer un message comme lu ou modifier le contenu
const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_read } = req.body;

    const message = await Message.findByPk(id);
    if (!message) return res.status(404).json({ message: 'Message non trouvé' });

    if (content !== undefined) message.content = content;
    if (is_read !== undefined) message.is_read = is_read;

    await message.save();
    return res.json(message);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// DELETE - supprimer un message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByPk(id);
    if (!message) return res.status(404).json({ message: 'Message non trouvé' });

    await message.destroy(); // soft delete si `paranoid: true`
    return res.json({ message: 'Message supprimé avec succès' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  sendMessage,
  getMessages, 
  getInbox, 
  updateMessage, 
  deleteMessage };