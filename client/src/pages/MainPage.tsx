import React from 'react';
import { Link } from 'react-router-dom';

const MainPage: React.FC = () => (
  <div className="">
    <h1 className="text-2xl font-semibold mb-4">Главное</h1>
    <ul>
      <li>
        <Link
          to="/organizations"
          className="text-blue-600 hover:underline"
        >
          Организации
        </Link>
      </li>
    </ul>
  </div>
);

export default MainPage;