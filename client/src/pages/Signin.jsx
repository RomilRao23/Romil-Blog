import { Alert, Button, Label, TextInput,Spinner } from 'flowbite-react'
import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'

export default function SignIn() {

  const [errorMessage,setErrorMessage]=useState(false);
  const [loading,setLoading]=useState(false);
  const [formData,setFormData]=useState({});

  const navigate=useNavigate();

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
  }

  const handleSubmit= async(e)=>{
    e.preventDefault();
    if( !formData.email || !formData.password){
      return setErrorMessage("All fields are required");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res=await fetch('/api/auth/signin',{
        method:'POST',
        headers:{ 'Content-Type': 'application/json'},
        body:JSON.stringify(formData),
      });
      const data=await res.json();
      if(data.success===false){
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen mt-20'>
        <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
          {/* LEFT SIDE DIV  */}
          <div className='flex-1'>
            <Link to='/' className='font-bold dark:text-white text-4xl'>
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                Romil's
              </span>
              Blog
            </Link>
            <p className=' mt-5 text-gray-700'>
              This is a demo project. You can sign in with your email and password
              or with Google.
            </p>
          </div>

          {/* RIGHT SIDE DIV  */}
          <div className='flex-1'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

              <div>
                <Label value='Your email'></Label>
                <TextInput 
                  type='email'
                  placeholder='Email'
                  id='email'
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label value='Your password'></Label>
                <TextInput 
                  type='password'
                  placeholder='*********'
                  id='password'
                  onChange={handleChange}
                />
              </div>

              <Button disabled={loading} gradientDuoTone='purpleToPink' type='submit'>
                {
                  loading ? (
                    <>
                      <Spinner size='sm' />
                      <span className='pl-3'>Loading...</span>
                    </>
                  ) : ('Sign In')
                }
              </Button>
            </form>
            <div className='flex gap-2 text-sm mt-5'> 
              <span>Don't have an account?</span>
              <Link to='/sign-up' className='text-blue-500'>
                Sign Up
              </Link>
            </div>
            {
              errorMessage &&(
                <Alert className='mt-5' color='failure'>
                  {errorMessage}
                </Alert>
              )
            }
          </div>
        </div>
    </div>
  )
}