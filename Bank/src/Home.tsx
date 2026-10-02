
import { Link } from 'react-router';

import LinkButton from './components/LinkButton';

function Home() {
  return (
<div className="flex min-h-screen items-center justify-center bg-[#a6abf7] p-4">
  <div className="w-full max-w-md rounded-xl bg-[#121e1f] p-8 shadow-lg">
    <h2 className="mb-6 text-center text-2xl font-bold text-[#a6abf7]">Sign In</h2>
    
    <form className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-[#a6abf7]">Email</label>
        <input 
          type="email" 
          className="w-full rounded-lg border border-[#e9e9f5] bg-[#705bd7] px-4 py-2 text-[#e9e9f5] outline-none transition-all placeholder:text-[#e9e9f5]/60 focus:border-[#a6abf7] focus:ring-2 focus:ring-[#a6abf7]"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#a6abf7]">Password</label>
        <input 
          type="password" 
          className="w-full rounded-lg border border-[#e9e9f5] bg-[#705bd7] px-4 py-2 text-[#e9e9f5] outline-none transition-all placeholder:text-[#e9e9f5]/60 focus:border-[#a6abf7] focus:ring-2 focus:ring-[#a6abf7]"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-[#705bd7] accent-[#e9e9f5] focus:ring-[#a6abf7]"/>
          <span className="ml-2 text-sm text-[#a6abf7]">Remember me</span>
        </label>
        <a href="#" className="text-sm text-[#a6abf7] hover:underline">Forgot password?</a>
      </div>

      <LinkButton
        color="#e9e9f5"
        text="Sign In"
        txtColor="#a6abf7"
        link="/Account"
        className="inline-flex w-full items-center justify-center rounded-lg border border-[#a6abf7] bg-[#e9e9f5] py-2.5 font-medium text-[#a6abf7] transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a6abf7]"
      />
    </form>

    <div className="mt-6 text-center text-sm text-[#a6abf7]">
      Don't have an account? 
      <Link to="/register" className="ml-1 font-medium text-[#a6abf7] underline hover:text-white">Sign up</Link>
    </div>
  </div>
</div>
  )
}
export default Home;