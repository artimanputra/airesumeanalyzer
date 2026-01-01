import type {Route} from "../../.react-router/types/app/routes/+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback For Your Dream Job!" },
  ];
}

export default function Home() {
  const {isLoading, auth} = usePuterStore();
  const navigate= useNavigate();

  //this for redirection if user tries to access routes which is not secured
  useEffect(()=>{
    if(!auth.isAuthenticated) navigate('/auth?next=/')
  },[auth.isAuthenticated])



  return <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
  <Navbar />
    <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Applications & Resume Ratings</h1>
          <h2>Review your submissions and Check AI-powered feedback.</h2>
        </div>
      {resumes.length>0 &&(
          <div className="resumes-section">
            {resumes.map((resume)=>(
                <ResumeCard key={resume.id} resume={resume}/>
            ))}
          </div>
      )}
    </section>


  </main>;
}
