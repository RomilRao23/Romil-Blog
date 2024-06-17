import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import {useSelector} from 'react-redux';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashProfile() {
    const {currentUser}=useSelector((state)=>state.user);
    const [imageFile,setImageFile]=useState(null);
    const [imageFileUrl,setImageFileUrl]=useState(null);
    const filePickerRef=useRef();
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
    const [updateUserError,setUpdateUserError]=useState(null);
    const dispatch=useDispatch();

    console.log(imageFileUploadProgress,imageFileUploadError);

    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        if(file){
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
        
    }

    useEffect(()=>{
        if(imageFile){
            uploadImage();
        }
    },[imageFile]);

    const uploadImage = async () => {
        // service firebase.storage {
        //   match /b/{bucket}/o {
        //     match /{allPaths=**} {
        //       allow read;
        //       allow write: if
        //       request.resource.size < 2 * 1024 * 1024 &&
        //       request.resource.contentType.matches('image/.*')
        //     }
        //   }
        // }
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
            setImageFileUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setImageFileUploadError(
              'Could not upload image (File must be less than 2MB)'
            );
            setImageFileUploadProgress(null);
            setImageFile(null);
            setImageFileUrl(null);
            setImageFileUploading(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageFileUrl(downloadURL);
              setFormData({ ...formData, profilePicture: downloadURL });
              setImageFileUploading(false);
            });
          }
        );
      };
    
      const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
      };
      //console.log(formData);

      const handleSubmit=async(e)=>{
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if(Object.keys(formData).length===0){
          setUpdateUserError('No changes made')
          return
        }
        if(imageFileUploading){
          setUpdateUserError('Please wait for image to upload');
          return
        }
        try {
          dispatch(updateStart());
          const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();

          if(!res.ok){
            dispatch(updateFailure(data.message));
            setUpdateUserError(data.message);
          }else{
            dispatch(updateSuccess(data));
            setUpdateUserSuccess('User profile has been updated successfully');
          }
        } catch (error) {
          dispatch(updateFailure(error.message));
          setUpdateUserError(error.message);
        }
      }
  return (
    <div className=' w-full max-w-lg mx-auto p-3 '>
    <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input 
            type='file' 
            accept='image/*'
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden/>
      <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' 
         onClick={() => filePickerRef.current.click()}>
           {imageFileUploadProgress && (
                <div className="hidden lg:flex lg:absolute lg:inset-0 lg:items-center lg:justify-center">
                <CircularProgressbar
                    value={imageFileUploadProgress || 0}
                    text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                    root: {
                        width: '21.1%',
                        height: '21.1%',
                        position: 'absolute',
                        top: '27.6%',
                        left: '47.8%',
                    },
                    path: {
                        stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                    },
                    }}
                />
                </div>
        )}
        <img src={ imageFileUrl || currentUser.profilePicture} 
           className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
            imageFileUploadProgress &&
            imageFileUploadProgress < 100 &&
            'opacity-60'
          }`}/> 
      </div>
      {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}

      <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
      />
      <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
      />
      <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
      />
       <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
       >
            Update
        </Button>  
    </form>

    <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>
            Delete Account
        </span>
        <span className='cursor-pointer'>
            Sign Out
        </span>
    </div>
    {updateUserSuccess && (
      <Alert color='success' className='mt-5'>
        {updateUserSuccess}
      </Alert>
    )}

    {updateUserError && (
      <Alert color='failure' className='mt-5'>
        {updateUserError}
      </Alert>
    )}
  </div>
  )
}
