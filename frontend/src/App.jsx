import { Navigate, Route, Routes } from "react-router-dom";


import Navbar from "./components/Navbar";



function App() {
  return (
    <div className='min-h-screen bg-white text-black relative overflow-hidden'>
	<div className='absolute inset-0 overflow-hidden'>
		<div className='absolute inset-0'>
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.8)_0%,rgba(240,240,240,0.6)_45%,rgba(220,220,220,0.4)_100%)]' />
		</div>
	</div>

	<div className='relative z-50 pt-20'>
		<Navbar />
		<Routes>
			{/* <Route path='/' element={<HomePage />} />
			<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
			<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} /> */}
		</Routes>
	</div>
</div>

	);
}

export default App;
