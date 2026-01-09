"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { storage } from "@/lib/firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    disabled?: boolean
    folder?: string
}

export function ImageUpload({ value, onChange, disabled, folder = "uploads" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image file (PNG, JPG, etc.)",
                variant: "destructive"
            })
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Image size should be less than 5MB",
                variant: "destructive"
            })
            return
        }

        try {
            setIsUploading(true)
            const timestamp = Date.now()
            const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
            const storageRef = ref(storage, `${folder}/${fileName}`)

            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                },
                (error) => {
                    toast({
                        title: "Upload failed",
                        description: "Could not upload image. Please try again.",
                        variant: "destructive"
                    })
                    setIsUploading(false)
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                    onChange(downloadURL)
                    setIsUploading(false)
                    toast({
                        title: "Success",
                        description: "Image uploaded successfully",
                    })
                }
            )

        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong while uploading.",
                variant: "destructive"
            })
            setIsUploading(false)
        }
    }

    const handleRemove = () => {
        onChange("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="space-y-4 w-full">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
                disabled={disabled || isUploading}
            />

            {value ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 group">
                    <Image
                        src={value}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            disabled={disabled}
                            onClick={handleRemove}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed border-gray-200 rounded-xl p-8 
                        flex flex-col items-center justify-center gap-3 
                        cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors
                        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                    `}
                >
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    ) : (
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700">
                            {isUploading ? "Uploading..." : "Click to upload image"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 5MB
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
