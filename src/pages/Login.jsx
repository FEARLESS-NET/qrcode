import React from 'react'

export default function Login() {
  return (
    <div>
        <div className="text-center text-2xl text-red-600 font-bold">
            <h1 className='text-2xl font-bold tracking-wide bg-gradient-to-r from-yellow-300 to-orange-600 bg-clip-text text-transparent p-10 ' > login registartsiya </h1>
        </div>
        <div className='text-center text-2xl text-red-600 font-bold pb-30 align-center pl-80  '>
            
            <form className=' w-120 h-130  align-center rounded-3xl z-0 bg-black/30 backdrop-blur-lg border-b border-red/70 shadow-lg px-6 py-3    '>
                <input type="text" placeholder='enter your name' className='text-1xl text-black text-center py-3 px-10 m-5  rounded-2xl hover:text-2xl invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20   border border-1px border-red-800' />
                <input type="text" placeholder='enter your surname' className='text-1xl text-black text-center py-3 px-10 m-5 rounded-2xl hover:text-2xl invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20  border border-1px border-red-800' />
                <input type="number" placeholder='enter your age' className='text-1xl text-black text-center py-3 px-10 m-5 rounded-2xl hover:text-2xl invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20  border border-1px border-red-800' />
                <input type="email" placeholder='enter your email' className='text-1xl text-black text-center py-3 px-10 m-5 rounded-2xl hover:text-2xl invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 border border-1px border-red-800' />
                <input type="password" placeholder='enter your password' className='text-1xl text-black text-center py-3 px-10 m-5 rounded-2xl hover:text-2xl invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 border border-1px border-red-800' />
            </form>
        </div>
    </div>
  )
}
