import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import Admin from './pages/Admin';
import BookingHistory from './pages/BookingHistory';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentDeposit from './pages/PaymentDeposit';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/mes-reservations" element={<BookingHistory />} />
            <Route path="/paiement" element={<PaymentDeposit />} />
            <Route path="/paiement/success" element={<PaymentSuccess />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
