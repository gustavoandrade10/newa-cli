import { ServiceResponseType } from "../enums/ServiceResponseType";

export interface ServiceResponse{
    type: ServiceResponseType;
    message: string;
}