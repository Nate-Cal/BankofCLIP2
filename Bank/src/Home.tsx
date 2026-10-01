
import { Link } from 'react-router';
import Button from './components/Button'

function Home() {
  return (
<div className="flex min-h-screen items-center justify-center bg-[#ECF0F1] p-4">
  <div className="w-full max-w-md rounded-xl bg-[#034F54] p-8 shadow-lg">
    <h2 className="mb-6 text-center text-2xl font-bold text-[#ECF0F1]">Sign In</h2>
    
    <form className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-[#ECF0F1]">Email</label>
        <input 
          type="email" 
          className="w-full rounded-lg border border-[#002D2A] bg-[#ECF0F1] px-4 py-2 text-[#002D2A] outline-none transition-all placeholder:text-[#002D2A]/60 focus:border-[#ECF0F1] focus:ring-2 focus:ring-[#ECF0F1]"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#ECF0F1]">Password</label>
        <input 
          type="password" 
          className="w-full rounded-lg border border-[#002D2A] bg-[#ECF0F1] px-4 py-2 text-[#002D2A] outline-none transition-all placeholder:text-[#002D2A]/60 focus:border-[#ECF0F1] focus:ring-2 focus:ring-[#ECF0F1]"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-[#ECF0F1] accent-[#002D2A] focus:ring-[#ECF0F1]"/>
          <span className="ml-2 text-sm text-[#ECF0F1]">Remember me</span>
        </label>
        <a href="#" className="text-sm text-[#ECF0F1] hover:underline">Forgot password?</a>
      </div>

      <Button
        color="#002D2A"
        text="Sign In"
        txtColor="#ECF0F1"
        link="/Balance"
        className="inline-flex w-full items-center justify-center rounded-lg border border-[#ECF0F1] bg-[#002D2A] py-2.5 font-medium text-[#ECF0F1] transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ECF0F1]"
      />
    </form>

    <div className="mt-6 text-center text-sm text-[#ECF0F1]">
      Don't have an account? 
      <Link to="/register" className="ml-1 font-medium text-[#ECF0F1] underline hover:text-white">Sign up</Link>
    </div>
  </div>
</div>
  )
}
export default Home;