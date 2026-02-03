const FamilyMember = require('../models/familyMember');
const Family = require('../models/family');
const Member = require('../models/member');


const createFamilyMember = async (req, res) => {
  try {
    const { family_id, member_id, role, is_admin } = req.body;

    if (!family_id || !member_id) {
      return res.status(400).json({ message: "Family_id et member_id sont obligatoires." });
    }

    const family = await Family.findByPk(family_id);
    if (!family) {
      return res.status(404).json({ message: "Famille introuvable." });
    }

    const member = await Member.findByPk(member_id);
    if (!member) {
      return res.status(404).json({ message: "Membre introuvable." });
    }

    const existing = await FamilyMember.findOne({ where: { family_id, member_id } });
    if (existing) {
      return res.status(400).json({ message: "Ce membre fait déjà partie de cette famille." });
    }

    const newFamilyMember = await FamilyMember.create({
      family_id,
      member_id,
      role: role || "other",
      is_admin: is_admin || false
    });

    res.status(201).json({
      message: "FamilyMember ajouté avec succès",
      familyMember: newFamilyMember
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllFamilyMembers = async (req, res) => {
  try {
    const familyMembers = await FamilyMember.findAll();
    res.json(familyMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFamilyMemberById = async (req, res) => {
  try {
    const familyMember = await FamilyMember.findByPk(req.params.id);
    if (!familyMember) {
      return res.status(404).json({ message: "FamilyMember non trouvé" });
    }
    res.json(familyMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFamilyMember = async (req, res) => {
  try {
    const familyMember = await FamilyMember.findByPk(req.params.id);
    if (!familyMember) {
      return res.status(404).json({ message: "FamilyMember non trouvé" });
    }

    await familyMember.update(req.body);
    res.json({ message: "FamilyMember mis à jour", familyMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFamilyMember = async (req, res) => {
  try {
    const familyMember = await FamilyMember.findByPk(req.params.id);
    if (!familyMember) {
      return res.status(404).json({ message: "FamilyMember non trouvé" });
    }

    await familyMember.destroy();
    res.json({ message: "FamilyMember supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFamilyMember,
  getAllFamilyMembers,
  getFamilyMemberById,
  updateFamilyMember,
  deleteFamilyMember
};
