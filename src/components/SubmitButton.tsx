import React from 'react'
import { Button } from './ui/button'

interface ButtonProps {
    isLoading: boolean
    className?: string
    children: React.ReactNode
}

const SubmitButton = ({ isLoading, children, className }: ButtonProps) => {
    return (
        <Button
            type='submit'
            disabled={isLoading}
            className={className ?? "shad-primary-btn w-full"}
        >
            {
                isLoading ? (
                    <div>
                        <div className="loader"></div>
                        <span className="ml-2">Loading...</span>
                    </div>
                ) : children
            }
        </Button>
    )
}

export default SubmitButton