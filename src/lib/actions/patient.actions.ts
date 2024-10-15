"use server";

import { ID, InputFile, Query } from "node-appwrite";

import {
    BUCKET_ID,
    DATABASE_ID,
    ENDPOINT,
    PATIENT_COLLECTION_ID,
    PROJECT_ID,
    databases,
    storage,
    users,
} from "../appwrite.config";

import { parseStringify } from "../utils";


// Create a new user
export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name,
        )
        return parseStringify(newUser);

    } catch (error: any) {
        console.log('error:', error);
        // Check existing user
        if (error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal("email", [user.email]),
            ]);

            return existingUser.users[0];
        }

        console.error("An error occurred while creating a new user:", error);
    }

};

// Get a user by ID
export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
        return parseStringify(user);

    } catch (error: any) {
        console.error("An error occurred while getting a user:", error);
    }
}


// Register a new patient
export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {

    try {

        // upload file to storage bucket
        let file;
        console.log('found identification document:', identificationDocument?.get('fileName'));

        if (identificationDocument) {
            const blobFile = identificationDocument.get("blobFile") as Blob;
            const fileName = identificationDocument.get("fileName") as string;

            if (!blobFile || !fileName) {
                console.error('blobFile or fileName is undefined');
                return;
            }

            const inputFile = await InputFile.fromBlob(blobFile, fileName);
            if (!inputFile) {
                console.error('inputFile is undefined');
                return;
            }

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
            console.log('file uploaded:', file.$id);

        } else {
            console.error('identificationDocument is undefined');
        }

        // create a new patient document
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: file?.$id ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
                    : null,
                ...patient,
            }
        )
        console.log('new patient:', newPatient?.$id);

        return parseStringify(newPatient);

    } catch (error: any) {
        console.error("An error occurred while registering a new patient:", error);
        // console.error("An error occurred while registering a new patient:");

    }
}

// Get a patient by ID
export const getPatient = async (userId: string) => {
    try {
        const patient = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal("userId", [userId]),]
        )

        return parseStringify(patient.documents[0]);

    } catch (error: any) {
        console.error("An error occurred while getting a patient:", error);

    }

}
