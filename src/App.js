import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, redirect } from 'react-router-dom';
import { CreateEventPage } from './CreateEvent';
import { ViewEventPage } from './ViewEvent';
import { NoPage } from './NoPage';

function App() {
  return (
    <BrowserRouter>
      <div className="header">
        <h1>Need a Ride?</h1>
      </div>

      <Routes>
        <Route path="ride" element={<ViewEventPage />} />
        <Route index element={<CreateEventPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
