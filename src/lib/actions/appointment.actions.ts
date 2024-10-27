"use server";

import { ID, Query } from "node-appwrite";

import {
    BUCKET_ID,
    DATABASE_ID,
    ENDPOINT,
    APPOINTMENT_COLLECTION_ID,
    PROJECT_ID,
    databases,
    storage,
    users,
} from "../appwrite.config";

import { parseStringify } from "../utils";


// Create Appointment
export const createAppointment = async (appointment: CreateAppointmentParams) => {

    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment,
        )

        return parseStringify(newAppointment);

    } catch (error: any) {
        console.error("An error occurred while creating a new appointment:", error);

    }

}

export const getAppointmentById = async (appointmentId: string) => {

    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
        )

        return parseStringify(appointment);

    } catch (error: any) {
        console.error("An error occurred while fetching appointment by id:", error);
    }
}