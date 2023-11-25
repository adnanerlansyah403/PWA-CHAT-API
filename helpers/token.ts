function generateCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }
  
function generateToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }

    return token;
}

function encryptToken(code, token) {

  // Membalikkan string code
  const reversedCode = code.split('').reverse().join('');

  // Membalikkan string token
  const reversedToken = token.split('').reverse().join('');

  return { code: reversedCode, token: reversedToken };


}

module.exports = {
    generateCode,
    generateToken,
    encryptToken,
}

