

function AccountPage() {
  return (
<main className="mx-auto w-full max-w-screen-2xl flex-1 p-4 pb-20 md:p-6">
  <div className="space-y-6">
    <div className="grid auto-rows-min gap-6 lg:grid-cols-3 ">
      <div className="aspect-video rounded-xl border-2 border-black bg-linear-to-br from-[#48197b] to-[#2c104d] lg:col-span-1 flex-col items-center justify-center text-center opacity-90">
        <h1 className="text-8xl text-[#e9e9f5]">Balance</h1>
        <h2 className="text-5xl text-[#e9e9f5]">$0.00</h2>
      </div>
      <div className="rounded-xl border-2 border-black bg-linear-to-br from-[#48197b] to-[#2c104d] lg:col-span-2 opacity-90 flex">
        <button className="w-1/2 h-full flex items-center justify-center text-[#e9e9f5] font-bold text-5xl bg-linear-to-br from-[#2c104d] to-[#48197b] ">
          Deposit
        </button>
        <button className="w-1/2 h-full flex items-center justify-center text-[#e9e9f5] font-bold text-5xl bg-linear-to-br from-[#48197b] to-[#2c104d]">
          Withdraw
        </button>
      </div>
      <div className="h-80 rounded-xl  border-2 border-black bg-linear-to-br from-[#48197b] to-[#2c104d] lg:col-span-full opacity-90">
       <h1 className="text-7xl text-[#e9e9f5]">Transaction stuff here</h1>
      </div>
      <div className="h-80 rounded-xl border-2 border-black bg-linear-to-br from-[#48197b] to-[#2c104d] lg:col-span-full opacity-90"> 
        <h1 className="text-7xl text-[#e9e9f5]">Transaction stuff here</h1>
      </div>
    </div>
  </div>
</main>
  );
}

export default AccountPage;