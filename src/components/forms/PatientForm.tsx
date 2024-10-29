"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
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
import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserFormValidation } from "@/lib/validation"
import { createUser, getPatient, getPatientByEmail } from "@/lib/actions/patient.actions"



const PatientForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true)
    try {
      const userData = { name, email, phone }

      const patient = await getPatientByEmail(email)
      if (patient) {
        router.push(`/patients/${patient.userId}/new-appointment`);
        return;
      }

      const newUser = await createUser(userData) // 3. Call your action.

      if (newUser) {
        console.log("New user created successfully", newUser.$id)
        router.push(`/patients/${newUser.$id}/register`);
      } else {
        console.error("An error occurred while creating a new user")
      }

    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4" >
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Sara Adams"
          iconAlt="User"
          iconSrc="/assets/icons/user.svg"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="name@example.com"
          iconAlt="Email"
          iconSrc="/assets/icons/email.svg"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />

        <SubmitButton isLoading={isLoading} >Get Started</SubmitButton>

      </form>
    </Form>
  )
}

export default PatientForm