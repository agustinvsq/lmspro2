import jwt from 'jsonwebtoken';

export function authenticate(handler) {
  return async (req, res) => {
    const authHeader = req.headers.authorization?.split(' ')[1];
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    try {
      const payload = jwt.verify(authHeader, process.env.JWT_SECRET);
      req.companyId = payload.companyId;
      return handler(req, res);
    } catch {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
}
