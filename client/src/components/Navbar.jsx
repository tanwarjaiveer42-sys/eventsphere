import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-md">
      <h1 className="text-3xl font-bold text-blue-600">
        EventSphere AI
      </h1>

      <ul className="flex gap-8 font-medium">
       <Link to="/">
  <li className="cursor-pointer hover:text-blue-600">
    Home
  </li>
</Link>
       <Link to="/events">
  <li className="cursor-pointer hover:text-blue-600">
    Events
  </li>
</Link>
        <li className="cursor-pointer hover:text-blue-600">About</li>
        <li className="cursor-pointer hover:text-blue-600">Contact</li>
      </ul>

     <Link
  to="/login"
  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
>
  Login
</Link>
    </nav>
  );
}

export default Navbar;