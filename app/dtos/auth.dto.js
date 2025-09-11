class LoginResponseDTO {
    constructor(user) {
        this.name = user.name;
        this.email = user.email;
        this.timestamp = new Date().toISOString();
    }
}

class RegisterResponseDTO {
    constructor() {
        this.timestamp = new Date().toISOString();
    }
}

class UserResponseDTO {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;
    }
}

module.exports = {
    LoginResponseDTO,
    RegisterResponseDTO,
    UserResponseDTO
};
