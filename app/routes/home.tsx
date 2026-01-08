import type {Route} from "../../.react-router/types/app/routes/+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import { resume } from "react-dom/server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback For Your Dream Job!" },
  ];
}

export default function Home() {
  const { auth,kv} = usePuterStore();
  const navigate= useNavigate();
  const [resumes, setResumes]= useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes]= useState(false);
 
 //this for redirection if user tries to access routes which is not secured
  useEffect(()=>{
    if(!auth.isAuthenticated) navigate('/auth?next=/')
  },[auth.isAuthenticated])
 
  useEffect(()=>{
   const loadResume= async()=>{
    setLoadingResumes(true);
    const resumes=(await kv.list('resume:*',true)) as KVItem[];
    
    const  parsedResumes= resumes?.map((resume)=>(
      JSON.parse(resume.value) as Resume
    ))
    console.log("ParsedResumes: " , parsedResumes);
    setResumes(parsedResumes ||[]);
    setLoadingResumes(false);
  }
   loadResume();
  },[])
 
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
  <Navbar />
    <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes?.length===0?(
            <h2>No resumes found. Upload your first resume to get started.</h2>
          ):(
            <h2>Review your submissions and Check AI-powered feedback.</h2>
          )}
        </div>
      {loadingResumes &&(
        <div className="flex flex-col items-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" />
        </div>
      )}

      {!loadingResumes && resumes.length>0 &&(
          <div className="resumes-section">
            {resumes.map((resume)=>(
                <ResumeCard key={resume.id} resume={resume}/>
            ))}
          </div>
      )}
      {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
    </section>


  </main>;
}
