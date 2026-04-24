import React from 'react'

const Home = () => {
  return (
    <div >
        <h1 className='text-center text-bold text-3xl mb-10 p-10'>Our Menu</h1>
       <div className='flex gap-5 '>
         <img className='h-[500px] w-full object-cover rounded-2xl' src="https://bunny-wp-pullzone-tnssu64psr.b-cdn.net/wp-content/uploads/sites/6/2025/10/@mooncakepictures-skylon-evening-dinner.jpg" alt="" />
        <img className='h-[250px] w-400 object-cover rounded-2xl' src='https://img.freepik.com/premium-photo/beautiful-restaurant-food-black-background-generative-ai_74760-6672.jpg'/>
       </div>
    </div>
  )
}

export default Home