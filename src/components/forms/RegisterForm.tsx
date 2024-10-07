"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { SelectItem } from "@/components/ui/select";
import {
    Doctors,
    GenderOptions,
    IdentificationTypes,
    PatientFormDefaultValues,
} from "@/constants";


import CustomFormField, { FormFieldType } from "../CustomFormField";
// import { FileUploader } from "../FileUploader";
import SubmitButton from "../SubmitButton";
import { PatientFormValidation } from "@/lib/validation";
import { SelectItem } from "../ui/select";
import { FileUploader } from "../FileUploader";

const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: user.name,
            email: user.email,
            phone: user.phone,
        },
    });

    const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
        setIsLoading(true);

    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="name"
                        placeholder="raj singh"
                        iconSrc="/assets/icons/user.svg"
                        iconAlt="user"
                    />

                    {/* EMAIL & PHONE */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="email"
                            label="Email address"
                            placeholder="johndoe@gmail.com"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="email"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="phone"
                            label="Phone Number"
                            placeholder="(031) 123-4567"
                        />
                    </div>

                    {/* BirthDate & Gender */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="birthDate"
                            label="Date of Birth"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.SKELETON}
                            control={form.control}
                            name="gender"
                            label="Gender"
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <RadioGroup
                                        className="flex h-11 gap-6 xl:justify-between"
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        {GenderOptions.map((option, i) => (
                                            <div key={option + i} className="radio-group">
                                                <RadioGroupItem value={option} id={option} />
                                                <Label htmlFor={option} className="cursor-pointer">
                                                    {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                    </div>
                    {/* Address & Occupation */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="address"
                            label="Address"
                            placeholder="1234 Main St"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="occupation"
                            label="Occupation"
                            placeholder="Software Engineer"
                        />

                    </div>

                    {/* Emergency Contact Name & Emergency Contact Number */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="emergencyContactName"
                            label="Emergency contact name"
                            placeholder="Guardian's name"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="emergencyContactNumber"
                            label="Emergency contact number"
                            placeholder="(555) 123-4567"
                        />
                    </div>
                </section>


                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>

                    {/* PRIMARY CARE PHYSICIAN */}
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="primaryPhysician"
                        label="Primary care physician"
                        placeholder="Select a physician"
                    >
                        {
                            Doctors.map((doctor, i) => (
                                <SelectItem key={doctor.name + i} value={doctor.name}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image}
                                            width={32}
                                            height={32}
                                            alt="doctor"
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))
                        }
                    </CustomFormField>

                    {/* INSURANCE & POLICY NUMBER */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="insuranceProvider"
                            label="Insurance provider"
                            placeholder="LIC Insurance"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="insurancePolicyNumber"
                            label="Insurance policy number"
                            placeholder="123456789"
                        />
                    </div>

                    {/* ALLERGY & CURRENT MEDICATIONS */}
                    <div className="flex flex-col gap-6 xl:flex-row">

                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="allergies"
                            label="Allergies (if any)"
                            placeholder="Peanuts, pollen, etc."
                        />

                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="currentMedication"
                            label="Current medications"
                            placeholder="Paracetamol, etc."
                        />
                    </div>
                    {/* FAMILY MEDICATION & PAST MEDICATIONS */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="familyMedicalHistory"
                            label="Family medical history (if relevant)"
                            placeholder="Diabetes, etc."
                        />

                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="pastMedicalHistory"
                            label="Past medical history"
                            placeholder="Broken arm, etc."
                        />
                    </div>
                </section>

                {/* IDENTIFICATION & VERIFICATION */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verfication</h2>
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="identificationType"
                        label="Identification type"
                        placeholder="Select an identification type"
                    >
                        {
                            IdentificationTypes.map((type, i) => (
                                <SelectItem key={type + i} value={type} >
                                    {type}
                                </SelectItem>
                            ))

                        }
                    </CustomFormField>

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="identificationNumber"
                        label="Identification number"
                        placeholder="123456789"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="identificationDocument"
                        label="Scanned Copy of Identification Document"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <FileUploader
                                    files={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        )}
                    />
                </section>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="treatmentConsent"
                        label="I consent to receive treatment for my health condition."
                    />

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="disclosureConsent"
                        label="I consent to the use and disclosure of my health
                    information for treatment purposes."
                    />

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="privacyConsent"
                        label="I acknowledge that I have reviewed and agree to the
                    privacy policy"
                    />
                </section>

                <SubmitButton isLoading={isLoading} >Submit and Continue</SubmitButton>

            </form>
        </Form >
    )
}

export default RegisterForm