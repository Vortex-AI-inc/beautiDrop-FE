'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

function BookingDialog({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
    return <DialogPrimitive.Root {...props} />
}

function BookingDialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger {...props} />
}

function BookingDialogPortal({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal {...props} />
}

function BookingDialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            className={cn(
                'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                className,
            )}
            {...props}
        />
    )
}

function BookingDialogContent({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
    return (
        <BookingDialogPortal>
            <BookingDialogOverlay />
            <DialogPrimitive.Content
                className={cn(
                    'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200',
                    className,
                )}
                {...props}
            >
                {children}
            </DialogPrimitive.Content>
        </BookingDialogPortal>
    )
}

export {
    BookingDialog,
    BookingDialogTrigger,
    BookingDialogContent,
    BookingDialogOverlay,
    BookingDialogPortal,
}
