import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';


const Layout = async ({ children }: { children: React.ReactNode }) => {

    const isUserAuthenticated = await isAuthenticated();
    !isUserAuthenticated && redirect('/sign-in');
    return (
        <div className="flex mx-auto max-w-7xl flex-col gap-12 my-12 px-16 max-sm:px-4 max-sm:my-8">
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-50 dark:border-gray-900">
                <div className="backdrop-blur-md bg-white/20 dark:bg-black/20 border-b border-gray-200/20 dark:border-gray-800/20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-16 max-sm:px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/images/interview-assist.png"
                                    alt="Interview Assist Logo"
                                    className="invert-0 dark:invert"
                                    width={38}
                                    height={32}
                                />
                                <h2 className="text-primary-100 font-medium">Interview Assist</h2>
                            </Link>

                            {/* Profile Section */}
                            <div className="flex items-center space-x-4">
                                <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <button className="focus:outline-none">
                                            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-offset-2 ring-gray-200 dark:ring-gray-800 transition-all hover:ring-gray-500 dark:hover:ring-gray-400">
                                                <AvatarImage src="/images/avatar.png" alt="User avatar" />
                                                <AvatarFallback className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-200 text-sm font-medium">
                                                    <Image src='/images/user.png' alt='User avatar' width={20} height={20} className='invert-0 dark:invert'/>
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Settings</DropdownMenuItem>
                                        <DropdownMenuItem>Interview History</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-500 dark:text-red-400">
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Add padding to account for fixed navbar */}
            <div className="mt-20">
                {children}
            </div>
        </div>


    )
}

export default Layout