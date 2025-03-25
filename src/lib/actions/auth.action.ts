'use server';  // declaring as server file
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

interface SignInParams {
    email: string,
    idToken: string
}
interface SignUpParams {
    uid: string,
    name: string,
    email: string,
    mobileNumber: string,
}

export async function signUp(params: SignUpParams) {
    const { uid, name, email, mobileNumber } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.',
            }
        }

        await db.collection('users').doc(uid).set({
            name, email, mobileNumber,
        })

        return {
            success: true,
            message: 'Account created successfully. Please sign in.'
        }
    } catch (error: any) {
        console.error('Error creating a user:', error);

        if (error.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is already in use. Please sign in instead.',
            }
        }

        return {
            success: false,
            message: 'An error occurred while creating the user. Please try again.',
        }
    }

}

export async function setSessionCookie(idToken: string) {
        const cookieStore = await cookies();
        const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn: 1000 *60 * 60 * 24 * 7, // 7 days
        });

        cookieStore.set('session', sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord){
            return{
                success: 'false',
                message: 'User does not exist. Create an account instead.'
            }
        }

        await setSessionCookie(idToken);
    } catch (error: any) {
        console.error('Error signing in:', error);
        return {
            success: 'false',
            message: 'Failed to log in.'
        }
        
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db
        .collection('users')
        .doc(decodedClaims.uid)
        .get();

        if(!userRecord.exists) return null;

        return { 
            ...userRecord.data(),
            id: userRecord.id
        } as User;
    } catch (error: any) {
        console.error('Error getting current user:', error);
    }
}

// Will use this function to get check if the user is authenticated to make frontend page secured
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}