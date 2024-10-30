"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CustomFormField, { FormFieldType } from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { getAppointmentSchema } from "@/lib/validation"
import { createUser } from "@/lib/actions/patient.actions"
import { Appointment } from "@/types/appwrite.types";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"



const AppointmentForm = ({ userId, patientId, type = "create", appointment, setOpen }: {
    userId: string;
    patientId: string;
    type: "create" | "schedule" | "cancel";
    appointment?: Appointment;
    setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);

    const AppointmentFormValidation = getAppointmentSchema(type)

    // 1. Define your form.
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment?.primaryPhysician || "",
            schedule: appointment
                ? new Date(appointment?.schedule!)
                : new Date(Date.now()),
            reason: appointment?.reason || "",
            note: appointment?.note || "",
            cancellationReason: appointment?.cancellationReason || "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true)
        let status;
        switch (type) {
            case "schedule":
                status = "scheduled";
                break;
            case "cancel":
                status = "cancelled";
                break;
            default:
                status = "pending";
        }

        // console.log(values)
        console.log(patientId, "patientId")

        try {
            if (type === "create" && patientId) {
                const newAppointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    status: status as Status,
                    note: values.note,
                };

                const newAppointment = await createAppointment(newAppointmentData)

                if (newAppointment) {
                    form.reset();
                    router.push(
                        `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
                    );
                }

            } else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values.primaryPhysician,
                        schedule: new Date(values.schedule),
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                    },
                    type,
                }

                const updatedAppointment = await updateAppointment(appointmentToUpdate)

                if (updatedAppointment) {
                    setOpen && setOpen(false)  
                    form.reset();
                }

            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    let butoonLabel;
    switch (type) {
        case "create":
            butoonLabel = "Request Appointment"
            break;
        case "schedule":
            butoonLabel = "Schedule Appointment"
            break;
        case "cancel":
            butoonLabel = "Cancel Appointment"
            break;
        default:
            butoonLabel = "submit appointment"
            break;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">

                {type === "create" && (
                    <section className="mb-12 space-y-4">
                        <h1 className="header">New Appointment</h1>
                        <p className="text-dark-700">
                            Request a new appointment in 10 seconds.
                        </p>
                    </section>
                )}

                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a doctor"
                        >
                            {
                                Doctors.map((doctor, i) => (
                                    <SelectItem key={doctor.name + i} value={doctor.name} >
                                        <div className="flex cursor-pointer items-center gap-2">
                                            <Image
                                                src={doctor.image}
                                                width={32}
                                                height={32}
                                                alt={doctor.name}
                                                className="rounded-full border border-dark-500"
                                            />
                                            <p>{doctor.name}</p>
                                        </div>
                                    </SelectItem>
                                ))
                            }
                        </CustomFormField>

                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="Expected appointment Date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy  -  h:mm aa"
                        />
                        <div
                            className={`flex flex-col gap-6 ${type === "create" && "xl:flex-row"} `}
                        >
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Reason for appointment"
                                placeholder="Enter your reason for appointment"
                                disabled={type === "schedule"}
                            />

                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="note"
                                label="Comments/Notes"
                                placeholder="Prefer afternoon appointments, if possible"
                                disabled={type === "schedule"}
                            />
                        </div>
                    </>
                )}

                {
                    type === "cancel" && (
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="cancellationReason"
                            label="Reason for cancellation"
                            placeholder="Urgent meeting at work"
                        />
                    )
                }
                <SubmitButton
                    isLoading={isLoading}
                    className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
                >
                    {butoonLabel}
                </SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm