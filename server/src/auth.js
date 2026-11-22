import jwt from 'jsonwebtoken'

export function signToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' })
}

export function authenticate(request, response, next) {
    const header = request.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) {
        return response.status(401).json({ message: 'Bạn cần đăng nhập để thực hiện thao tác này.' })
    }
    try {
        request.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch {
        response.status(401).json({ message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' })
    }
}