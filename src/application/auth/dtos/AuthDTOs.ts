export interface UserResponseDTO {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  user: UserResponseDTO;
}
