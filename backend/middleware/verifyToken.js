import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401)
    const token = authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(403);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.id = decoded.id;
        next();
    })
}

export const Testing = (req,res) =>{
    const id = req.id
    res.json({id});
}