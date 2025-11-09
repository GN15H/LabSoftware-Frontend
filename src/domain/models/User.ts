import { SpecialtyType, UserType, userTypeFromId } from "./types";

export interface IUserMap {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  email: string;
  birth_date: string;
  user_type_id: number;
}

interface IUser {
  id: number;
  dni: string;
  name: string;
  lastName: string;
  email: string;
  birthDate: Date;
  userType: UserType;
  specialties: SpecialtyType[] | null;
};

export class User {
  id: number;
  dni: string;
  name: string;
  lastName: string;
  email: string;
  birthDate: Date;
  userType: UserType;
  specialties: SpecialtyType[] | null;

  constructor({ id, dni, name, lastName, email, birthDate, userType, specialties = null }: IUser) {
    this.id = id;
    this.dni = dni;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.birthDate = birthDate;
    this.userType = userType;
    this.specialties = specialties;
  }

  static fromMap({ id, dni, name, last_name, email, birth_date, user_type_id }: IUserMap): User {
    return new User({
      id: id,
      dni: dni,
      name: name,
      lastName: last_name,
      email: email,
      birthDate: new Date(birth_date),
      userType: userTypeFromId(user_type_id),
      specialties: null
    })
  }
}
