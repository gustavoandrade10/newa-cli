export interface IDatabaseConnection{
    username: string;
    password: string;
    database: string,
    host: string;
    dialect: string;
    //used to know which environment user is using , development , production
    environment: string; 
}