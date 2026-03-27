const Reservation = require('../models/reservation')
const Salle = require('../models/salle')
const User = require('../models/user')
const Notification = require('../models/notification')
const Disponibilite = require('../models/disponibilite')


const createReservation = async (req, res) => {
  console.log('--- Nouvelle tentative de réservation ---');
  console.log('Utilisateur:', req.user);
  console.log('Corps de la requête:', req.body);
  try {
    if (req.user.role !== 'CLIENT') return res.status(403).json({ message: 'Accès réservé aux clients' })

    const { salle_id, date, creneau, montant_total, num_tel, mode_paiement } = req.body
    if (!salle_id || !date || !creneau || !montant_total) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' })
    }

    const salle = await Salle.findByPk(salle_id)
    if (!salle) return res.status(404).json({ message: 'Salle non trouvée' })

    const reservation = await Reservation.create({
      salle_id,
      user_id: req.user.id,
      date,
      creneau,
      montant_total,
      num_tel,
      mode_paiement,
      statut: 'EN_ATTENTE'
    })
    res.status(201).json({ message: 'Réservation créée avec succès', reservation })
  } catch (error) {
    console.error('Erreur createReservation:', error);
    res.status(500).json({ error: error.message })
  }
}

const getMyReservations = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') return res.status(403).json({ message: 'Accès réservé aux clients' })
    const reservations = await Reservation.findAll({ where: { user_id: req.user.id }, include: [Salle] })
    res.json(reservations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getProprietaireReservations = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Salle,
          where: { proprietaire_id: req.user.id }
        },
        {
          model: User,
          attributes: ['id', 'nom', 'telephone']
        }
      ]
    })
    res.json(reservations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateReservationStatus = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') return res.status(403).json({ message: 'Accès réservé aux propriétaires' })

    const reservation = await Reservation.findByPk(req.params.id, { include: [Salle] })
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' })
    
    // Correction de l'accès à la salle (vérifier les deux cas)
    const salle = reservation.Salle || reservation.salle;
    if (!salle) return res.status(500).json({ message: 'Erreur: Salle non liée à la réservation' });

    if (salle.proprietaire_id !== req.user.id) return res.status(403).json({ message: 'Impossible de modifier cette réservation' })

    const { statut } = req.body
    if (!['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE', 'TERMINEE'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' })
    }

    await reservation.update({ statut })

    // 1. Notification pour le client
    if (statut === 'CONFIRMEE' || statut === 'ANNULEE') {
      try {
        await Notification.create({
          user_id: reservation.user_id,
          salle_id: reservation.salle_id,
          titre: statut === 'CONFIRMEE' ? 'Réservation confirmée !' : 'Réservation annulée',
          message: statut === 'CONFIRMEE' 
            ? `Votre réservation pour la salle ${salle.nom} a été acceptée.` 
            : `Désolé, votre réservation pour la salle ${salle.nom} a été refusée.`,
        })
      } catch (notifError) {
        console.error('Erreur lors de la création de la notification:', notifError);
      }
    }

    // 2. Gestion de la table Disponibilite
    if (statut === 'CONFIRMEE') {
      try {
        await Disponibilite.findOrCreate({
          where: {
            salle_id: reservation.salle_id,
            date: reservation.date,
            creneau: reservation.creneau
          },
          defaults: { statut: 'RESERVE' }
        }).then(([dispo, created]) => {
          if (!created) dispo.update({ statut: 'RESERVE' });
        });
      } catch (dispoError) {
        console.error('Erreur synchronisation disponibilité:', dispoError);
      }
    } else if (statut === 'ANNULEE' || statut === 'EN_ATTENTE') {
      try {
        await Disponibilite.update(
          { statut: 'LIBRE' },
          { 
            where: { 
              salle_id: reservation.salle_id, 
              date: reservation.date, 
              creneau: reservation.creneau 
            } 
          }
        );
      } catch (dispoError) {
        console.error('Erreur libération disponibilité:', dispoError);
      }
    }

    res.json({ message: 'Statut mis à jour avec succès', reservation })
  } catch (error) {
    console.error('Erreur updateReservationStatus:', error);
    res.status(500).json({ error: error.message })
  }
}

const deleteReservation = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT' && req.user.role !== 'PROPRIETAIRE') return res.status(403).json({ message: 'Accès refusé' })
    
    const reservation = await Reservation.findByPk(req.params.id)
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' })

    // Libérer la date dans Disponibilite avant de supprimer
    try {
      await Disponibilite.update(
        { statut: 'LIBRE' },
        { 
          where: { 
            salle_id: reservation.salle_id, 
            date: reservation.date, 
            creneau: reservation.creneau 
          } 
        }
      );
    } catch (dispoError) {
      console.error('Erreur libération dispo lors de la suppression:', dispoError);
    }

    await reservation.destroy()
    res.json({ message: 'Réservation supprimée avec succès' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getBlockedDates = async (req, res) => {
  try {
    const { salle_id } = req.params
    const disponibilites = await Disponibilite.findAll({
      where: {
        salle_id,
        statut: 'RESERVE'
      },
      attributes: ['date']
    })
    const dates = disponibilites.map(d => {
      if (d.date instanceof Date) {
        return d.date.toISOString().split('T')[0];
      }
      return d.date;
    })
    res.json(dates)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createReservation,
  getMyReservations,
  getProprietaireReservations,
  updateReservationStatus,
  deleteReservation,
  getBlockedDates
}
