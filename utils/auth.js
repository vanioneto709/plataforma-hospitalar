// utils/auth.js
import jwt from 'jsonwebtoken';

// Pega a chave secreta que você definiu no seu .env
const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * Verifica o Token JWT do cabeçalho de autorização e extrai as informações do usuário.
 * POR QUE? Para garantir que o usuário logado só crie ou veja dados da sua própria clínica (Multi-inquilino).
 */
export function verifyTokenAndGetInfo(request) {
    const authHeader = request.headers.get('Authorization');
    // Espera o formato: "Bearer [token_aqui]"
    const token = authHeader?.split(' ')[1];

    if (!token) return null;

    try {
        // Tenta verificar se o token é válido e não foi adulterado, usando a chave secreta
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Retorna as informações essenciais que colocamos no token
        return { 
            userId: decoded.userId, 
            clinicId: decoded.clinicId,
            role: decoded.role 
        };
    } catch (error) {
        // Se a verificação falhar (token expirado ou inválido)
        return null; 
    }
}