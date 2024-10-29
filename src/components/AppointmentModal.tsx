"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Appointment } from "@/types/appwrite.types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import AppointmentForm from "./forms/AppointmentForm";

export const AppointmentModal = ({
    patientId,
    userId,
    appointment,
    type,
    title,
    description
}: {
    patientId: string,
    userId: string,
    appointment: Appointment,
    type: "schedule" | "cancel";
    title: string,
    description: string
}

) => {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen} >

            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className={`capitalize ${type === "schedule" && "text-green-500"}`}
                >{type}
                </Button>
            </DialogTrigger>

            <DialogContent className="shad-dialog sm:max-w-md">

                <DialogHeader className="mb-4 space-y-3">
                    <DialogTitle className="capitalize">{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <AppointmentForm
                    userId={userId}
                    patientId={patientId}
                    type={type}
                    appointment={appointment}
                    setOpen={setOpen}
                />

            </DialogContent>
        </Dialog>
    )
}
