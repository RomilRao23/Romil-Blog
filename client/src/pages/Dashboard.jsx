import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashProfile from '../components/DashProfile';
import DashSidebar from '../components/DashSidebar';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';

export default function Dashboard() {
  const location=useLocation();
  const [tab,setTab]=useState('');

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* SIDEBAR */}
      <div className='md:w-56'>
        <DashSidebar/>
      </div>

      {/* PROFILE....ETC */}
      {tab==='profile' && <DashProfile/>}

      {/* DASH POSTS */}
      {tab==='posts'&&<DashPosts/>}

      {/* USERS */}
      {tab==='users' &&<DashUsers/>}
      
    </div>
  )
}
