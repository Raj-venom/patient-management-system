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
import { revalidatePath } from "next/cache";
import { Appointment } from "@/types/appwrite.types";


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

export const updateAppointment = async ({
    appointmentId,
    userId,
    timeZone,
    appointment,
    type,
}: UpdateAppointmentParams) => {
    try {

        const updateAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment,
        )

        if (!updateAppointment) {
            throw new Error("An error occurred while updating appointment");
        }
        // Sms notification todo

        revalidatePath("/admin")
        return parseStringify(updateAppointment);

    } catch (error: any) {
        console.error("An error occurred while updating appointment:", error);

    }
}


export const getRecentAppointmentList = async () => {

    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")],
        )

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
                switch (appointment.status) {
                    case "scheduled":
                        acc.scheduledCount += 1;
                        break;
                    case "pending":
                        acc.pendingCount += 1;
                        break;
                    case "cancelled":
                        acc.cancelledCount += 1;
                        break;
                }

                return acc;
            },
            initialCounts,
        )

        const data = {
            totalCounts: appointments.total,
            ...counts,
            documents: appointments.documents,
        }

        return parseStringify(data);

    } catch (error: any) {
        console.error("An error occurred while fetching recent appointment list:", error);

    }
}