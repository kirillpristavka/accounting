import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const MainPage: React.FC = () => {
  const { isActive, setIsActive } = useAppContext();  

  return (
  <div className="p-2">
      <h1 className="text-2xl font-semibold mb-4">Главное</h1>
      <ul>
        <li>
          <Link
            to="/organizations"
            onClick={() => {setIsActive("")}}
            className="text-blue-600 hover:underline"
          >
            Организации
          </Link>
        </li>
        <li>
          <Link
            to="/nomenclature"
            onClick={() => {setIsActive("")}}
            className="text-blue-600 hover:underline"
          >
            Номенклатура
          </Link>
        </li>
      </ul>
    </div>
  ) 
};

export default MainPage;