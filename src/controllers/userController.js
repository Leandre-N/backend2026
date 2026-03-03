const User = require('../models/user')
const Salle = require('../models/salle')
const Reservation = require('../models/reservation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');


const createUser = async (req, res) => {
  try {
    const { nom, email, telephone, mot_de_passe, role } = req.body || {}
    
    if (!nom || !email || !telephone || !mot_de_passe) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' })
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10); 

    

    const user = await User.create({
      nom,
      email,
      telephone,
      mot_de_passe: hashedPassword,
      role: role || 'CLIENT'
    })

    res.status(201).json({ message: 'Utilisateur créé avec succès', user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });


    const token = jwt.sign(
      { id: user.id, role: user.role }, // payload
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.json({ message: 'Connexion réussie',
     "token":token, user });
  } catch (error) {
    res.status(500).json({ error: error.message, });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['mot_de_passe'] }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['mot_de_passe'] }
    })
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { nom, telephone, role, verified } = req.body
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' })
    await user.update({ nom, telephone, role, verified })
    res.json({ message: 'Utilisateur mis à jour avec succès', user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' })
    await user.destroy()
    res.json({ message: 'Utilisateur supprimé avec succès' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getMyReservations = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') return res.status(403).json({ message: 'Accès réservé aux clients' })
    const reservations = await Reservation.findAll({ where: { user_id: req.user.id } })
    res.json(reservations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getProprietaireDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    const salles = await Salle.findAll({ where: { proprietaire_id: req.user.id } })
    const reservations = await Reservation.findAll({
      include: [{ model: Salle, where: { proprietaire_id: req.user.id } }]
    })
    res.json({
      total_salles: salles.length,
      total_reservations: reservations.length,
      salles,
      reservations
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyReservations,
  getProprietaireDashboard
}
