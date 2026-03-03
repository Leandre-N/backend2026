const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // 1️⃣ Récupérer le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token manquant" });
    }

    // 2️⃣ Vérifier le format "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Token invalide" });
    }

    // 3️⃣ Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Injecter l'utilisateur dans la requête
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }

}
const authorize = (roles = []) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: "non authentifié" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "accès refusé" })
    }
    next()
  }
};

module.exports = { auth, authorize };
