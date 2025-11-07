"use client"

import CreateBuildingForm from "@/components/admin/create-building-form"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CreateRequestPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user.isConnected) {
      router.push("/")
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Create New Asset Token Request</h2>
          <p className="text-muted-foreground text-sm">
            Fill out the form below to submit a request to tokenize a new building asset.
          </p>
        </div>
        <CreateBuildingForm />
      </div>
    </div>
  )
}
