export interface User{
    id?: string,
    name: string,
    email?: string,
    password: string,
    createdAt?: Date
}

export interface Task{
    id?: string,
    taskContent: string,
    userId?: string,
    createdAt?: Date
}