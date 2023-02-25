import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreateEventPage } from './CreateEvent';
import { ViewEventPage } from './ViewEvent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="events" element={<ViewEventPage />} />
        <Route index path="*" element={<CreateEventPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
