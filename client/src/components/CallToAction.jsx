import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div  className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        {/* LEFT SIDE */}
      <div className="flex-1 justify-center flex flex-col">
        <h2 className='text-2xl'>
            Want to learn more about about MERN 
        </h2>
        <p className='text-gray-500 my-2'>
            Check out these resources for projects
        </p>
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl mt-4 rounded-bl-none'>
            <a href="https://github.com/RomilRao23" target='_blank' >
                 Projects
            </a>
        </Button>
      </div>

        {/* FOR IMAGE */}
      <div className='p-7 flex-1'>
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPnfj_PdfHzyNebKKRpuxJQw8267pRkP0Xog&s'/>
      </div>
    </div>
  )
}
