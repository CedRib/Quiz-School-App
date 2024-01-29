import 'reflect-metadata';

export enum Role {
    Teacher = 1, Student = 0
}



export class User {

    id?: number;
    pseudo?: string;
    password?: string;
    email?: string;
    lastName?: string;
    firstName?: string;
    birthDate?: Date;
    role?: Role;
    token?: string;
    refreshToken?: string;


}



