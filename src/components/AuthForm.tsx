'use client'

import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PhoneInput } from '@/components/PhoneInput'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/auth.action'

const signInSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = signInSchema.extend({
    name: z.string().min(1, 'Name is required'),
    mobileNumber: z
        .string()
        .min(8, 'Enter a valid phone number') // International numbers vary in length
        .max(15, 'Enter a valid phone number'),

})

const AuthForm = ({ type }: { type: 'signIn' | 'signUp' }) => {
    const router = useRouter();
    const isSignUp = type === 'signUp'
    const schema = isSignUp ? signUpSchema : signInSchema

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: isSignUp
            ? {
                name: '',
                mobileNumber: '',
                email: '',
                password: '',
            }
            : {
                email: '',
                password: '',
            },
    })

    const labelClass = 'dark:!text-white !text-gray-700 text-sm font-medium'

    // async function onSubmit(values: z.infer<typeof schema>) {
    //     console.log('Form values', values)
    //     try {
    //         if (type === 'signUp') {
    //             const { name, email, mobileNumber, password } = values;
    //             console.log('name, email, mobileNumber, password,', name, email, mobileNumber, password)

    //             const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

    //             const result = await signUp({
    //                 uid: userCredentials.user.uid,
    //                 name,
    //                 email,
    //                 mobileNumber,
    //             })

    //             console.log('result', result)

    //             if (!result?.success) {
    //                 toast.error(result?.message || 'Failed to create account.')
    //                 return;
    //             }
    //             toast.success('Account created successfully. Please sign in.');
    //             router.push('/sign-in');
    //         } else {
    //             const { email, password } = values;
    //             const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //             const idToken = await userCredential.user.getIdToken();
    //             if (!idToken) {
    //                 toast.error('Sign in failed');
    //                 return;
    //             }
    //             await signIn({
    //                 email, idToken
    //             })

    //             toast.success('Sign in successfull')
    //         }
    //     } catch (error: any) {

    //     }
    // }
    async function onSubmit(values: z.infer<typeof schema>) {
        console.log('Form values', values)
        try {
            if (type === 'signUp') {
                const { name, email, mobileNumber, password } = values;
                console.log('name, email, mobileNumber, password,', name, email, mobileNumber, password)

                try {
                    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                    const result = await signUp({
                        uid: userCredentials.user.uid,
                        name,
                        email,
                        mobileNumber,
                    })

                    if (!result?.success) {
                        toast.error(result?.message || 'Failed to create account');
                        return;
                    }

                    toast.success('Account created successfully. Please sign in.');
                    router.push('/sign-in');
                } catch (error: any) {
                    console.error('Error creating a user:', error);
                    // Handle Firebase Auth specific errors
                    const errorCode = error.code;

                    const errorMessages: Record<string, string> = {
                        'auth/email-already-in-use': 'Email already in use. Please sign in instead.',
                        'auth/invalid-email': 'Invalid email address.',
                        'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
                        'auth/weak-password': 'Password is too weak. Please use a stronger password.',

                    };
                    const errorMessage = errorMessages[errorCode] || 'Failed to create account. Please try again.';
                    toast.error(errorMessage);
                }
            } else {
                const { email, password } = values;
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const idToken = await userCredential.user.getIdToken();

                    if (!idToken) {
                        toast.error('Sign in failed');
                        return;
                    }

                    await signIn({
                        email,
                        idToken
                    });

                    toast.success('Sign in successful');
                    router.push('/'); // Redirect to home page after successful sign in
                } catch (error: any) {
                    console.error('Firebase sign-in error:', error);
                    const errorCode = error.code;

                    const errorMessages: Record<string, string> = {
                        'auth/user-not-found': 'No account found with this email. Please sign up.',
                        'auth/wrong-password': 'Incorrect password. Please try again.',
                        'auth/invalid-email': 'Invalid email format.',
                        'auth/user-disabled': 'This account has been disabled. Contact support.',
                        'auth/too-many-requests': 'Too many failed attempts. Try again later.',
                        'auth/invalid-credential': 'Invalid email or password. Please try again.', // <== Add this!
                    };
                    const message = errorMessages[errorCode] || 'Sign in failed. Please try again.';
                    toast.error(message);
                }
            }
        } catch (error: any) {
            console.error('Authentication error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        }
    }


    return (
        <div className="flex flex-col items-center w-full max-w-md">
            {/* Logo and Motto Section */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-2">
                    <Image
                        src="/images/interview-assist.png"
                        alt="Logo of Interview Assist"
                        width={40}
                        height={40}
                        className="invert-0 dark:invert"
                    />
                    <h1 className="text-2xl font-bold ml-2 dark:text-white">Interview Assist</h1>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm">Your path to interview success</p>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 max-w-md w-full"
                    noValidate
                >
                    {isSignUp && (
                        <>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Your name"
                                            />
                                        </FormControl>
                                        {fieldState.error && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="mobileNumber"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}>Mobile Number</FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                {...field}
                                                defaultCountry='IN'
                                                placeholder="Enter your phone number"
                                                className='w-full'
                                            />
                                        </FormControl>
                                        {fieldState.error && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className={labelClass}>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter your email"
                                    />
                                </FormControl>
                                {fieldState.error && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className={labelClass}>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="Enter your password"
                                    />
                                </FormControl>
                                {fieldState.error && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <div className="text-center text-sm mt-2">
                        {isSignUp ? (
                            <p>
                                Already have an account?{' '}
                                <Link href="/sign-in" className="text-blue-600 hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        ) : (
                            <p>
                                Don&apos;t have an account?{' '}
                                <Link href="/sign-up" className="text-blue-600 hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        )}
                    </div>

                </form>
            </Form>
        </div>
    )
}

export default AuthForm
